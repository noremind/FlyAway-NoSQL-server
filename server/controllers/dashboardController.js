import TourModel from "../models/Tour.js"
import HotelModel from "../models/Hotel.js"
import PartnerModel from "../models/Partner.js"
import UserModel from "../models/User.js"
import HotelRequestModel from "../models/HotelRequest.js"
import ContentViewModel from "../models/ContentView.js"

const DAY_MS = 24 * 60 * 60 * 1000

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const parseBookingDate = (value) => {
	const text = normalizeString(value)

	if (!text) {
		return null
	}

	const parsed = /^\d{4}-\d{2}-\d{2}$/.test(text)
		? new Date(`${text}T00:00:00`)
		: new Date(text)

	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const getDateKey = (value) => {
	const date = value ? new Date(value) : new Date()
	if (Number.isNaN(date.getTime())) return "unknown"

	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, "0"),
		String(date.getDate()).padStart(2, "0"),
	].join("-")
}

const getStartDate = (days = 30) => {
	const date = new Date()
	date.setHours(0, 0, 0, 0)
	date.setDate(date.getDate() - Math.max(0, Number(days) - 1 || 0))
	return date
}

const buildTimeline = (days = 30) => {
	const count = Math.max(7, Math.min(90, Number(days) || 30))

	return Array.from({ length: count }).map((_, index) => {
		const date = getStartDate(count - index)
		const key = getDateKey(date)

		return {
			date: key,
			label: new Intl.DateTimeFormat("ru-RU", {
				day: "2-digit",
				month: "short",
			}).format(date),
			views: 0,
			bookings: 0,
			hotelRequests: 0,
			revenue: 0,
			moneyAmount: 0,
			bonusAmount: 0,
		}
	})
}

const deriveBookingStatus = (booking) => {
	const currentStatus = normalizeString(booking?.status) || "active"

	if (currentStatus !== "active") {
		return currentStatus
	}

	const parsedDate = parseBookingDate(booking?.date)

	if (!parsedDate) {
		return currentStatus
	}

	return parsedDate.getTime() < Date.now() - DAY_MS
		? "completed"
		: currentStatus
}

const getBookingMoneyAmount = (booking) => {
	if (booking?.paidWithMoney !== undefined) {
		return Math.max(0, Number(booking.paidWithMoney) || 0)
	}

	return Math.max(0, Number(booking?.total) || 0)
}

const getBookingBonusAmount = (booking) => Math.max(
	0,
	Number(booking?.paidWithBonuses ?? booking?.bonusSpent) || 0
)

const getEmptyBookingStats = () => ({
	total: 0,
	active: 0,
	completed: 0,
	cancelled: 0,
	revenue: 0,
	moneyAmount: 0,
	bonusAmount: 0,
})

const getEmptyRequestStats = () => ({
	total: 0,
	new: 0,
	in_progress: 0,
	contacted: 0,
	closed: 0,
	cancelled: 0,
})

const ensureMapItem = (map, id, defaults) => {
	const key = String(id || "")
	if (!key) return null
	if (!map.has(key)) map.set(key, { ...defaults, _id: key })
	return map.get(key)
}

export const getDashboardSummary = async (req, res) => {
	try {
		const isPartner = req.userRole === "partner"
		const partnerFilter = isPartner ? { partner: req.partnerId } : {}
		const rangeDays = Math.max(7, Math.min(90, Number(req.query.rangeDays) || 30))
		const startDate = getStartDate(rangeDays)
		const timelineMap = new Map(buildTimeline(rangeDays).map((item) => [item.date, item]))

		const [usersCount, partnersCount, tours, hotels, allRequests, recentRequests, bookingUsers, views] =
			await Promise.all([
				isPartner ? Promise.resolve(0) : UserModel.countDocuments(),
				isPartner ? Promise.resolve(1) : PartnerModel.countDocuments(),
				TourModel.find(partnerFilter)
					.select("title partner createdAt price discount")
					.sort({ createdAt: -1 }),
				HotelModel.find(partnerFilter)
					.select("name partner createdAt price discount")
					.sort({ createdAt: -1 }),
				HotelRequestModel.find(isPartner ? { partner: req.partnerId } : {})
					.populate("hotel")
					.sort({ createdAt: -1 }),
				HotelRequestModel.find(isPartner ? { partner: req.partnerId } : {})
					.populate("hotel")
					.sort({ createdAt: -1 })
					.limit(8),
				UserModel.find({ "tourBookings.0": { $exists: true } })
					.select("name email phone tourBookings createdAt updatedAt")
					.populate({
						path: "tourBookings.tour",
						select: "title partner",
						populate: { path: "partner", select: "title" },
					}),
				ContentViewModel.find({
					...(isPartner ? { partner: req.partnerId } : {}),
					viewedAt: { $gte: startDate },
				}).select("contentType content viewedAt"),
			])

		const allowedTourIds = new Set(tours.map((item) => String(item._id)))
		const allowedHotelIds = new Set(hotels.map((item) => String(item._id)))
		const tourPerformance = new Map()
		const hotelPerformance = new Map()

		for (const tour of tours) {
			ensureMapItem(tourPerformance, tour._id, {
				title: tour.title,
				bookings: 0,
				views: 0,
				revenue: 0,
				moneyAmount: 0,
				bonusAmount: 0,
			})
		}

		for (const hotel of hotels) {
			ensureMapItem(hotelPerformance, hotel._id, {
				title: hotel.name,
				requests: 0,
				views: 0,
				revenue: 0,
			})
		}

		for (const view of views) {
			const dateKey = getDateKey(view.viewedAt)
			const bucket = timelineMap.get(dateKey)
			if (bucket) bucket.views += 1

			const map = view.contentType === "hotel" ? hotelPerformance : tourPerformance
			const item = map.get(String(view.content))
			if (item) item.views += 1
		}

		const bookingStats = getEmptyBookingStats()
		const requestStats = getEmptyRequestStats()

		const recentBookings = bookingUsers
			.flatMap((user) => {
				const items = Array.isArray(user.tourBookings) ? user.tourBookings : []

				return items
					.filter((booking) => booking?.tour)
					.filter((booking) => {
						if (!isPartner) return true
						return allowedTourIds.has(String(booking.tour?._id || booking.tour))
					})
					.map((booking) => {
						const status = deriveBookingStatus(booking)
						const moneyAmount = getBookingMoneyAmount(booking)
						const bonusAmount = getBookingBonusAmount(booking)
						const revenue = moneyAmount + bonusAmount
						const createdAt = booking?.createdAt || booking?.bookedAt || user.updatedAt || user.createdAt
						const dateKey = getDateKey(createdAt)
						const bucket = timelineMap.get(dateKey)
						const tourId = String(booking.tour?._id || booking.tour)
						const performance = tourPerformance.get(tourId)

						bookingStats.total += 1
						bookingStats[status] += 1
						bookingStats.revenue += revenue
						bookingStats.moneyAmount += moneyAmount
						bookingStats.bonusAmount += bonusAmount

						if (bucket) {
							bucket.bookings += 1
							bucket.revenue += revenue
							bucket.moneyAmount += moneyAmount
							bucket.bonusAmount += bonusAmount
						}

						if (performance) {
							performance.bookings += 1
							performance.revenue += revenue
							performance.moneyAmount += moneyAmount
							performance.bonusAmount += bonusAmount
						}

						return {
							_id: booking._id,
							status,
							date: booking.date,
							total: Number(booking?.total) || 0,
							paidWithBonuses: bonusAmount,
							paidWithMoney: moneyAmount,
							guests: Number(booking?.guests) || 0,
							paymentMethod: booking?.paymentMethod || "card",
							createdAt,
							tour: booking.tour,
							customer: {
								name: user.name,
								email: user.email,
								phone: user.phone,
							},
						}
					})
			})
			.sort(
				(left, right) =>
					new Date(right.createdAt || 0).getTime() -
					new Date(left.createdAt || 0).getTime()
			)
			.slice(0, 8)

		for (const request of allRequests) {
			const status = normalizeString(request?.status) || "new"
			const hotelId = String(request?.hotel?._id || request?.hotel || "")
			const bucket = timelineMap.get(getDateKey(request.createdAt))
			const performance = hotelPerformance.get(hotelId)

			requestStats.total += 1
			if (Object.prototype.hasOwnProperty.call(requestStats, status)) {
				requestStats[status] += 1
			}

			if (bucket) bucket.hotelRequests += 1
			if (performance) performance.requests += 1
		}

		const paymentTotal = bookingStats.moneyAmount + bookingStats.bonusAmount

		return res.json({
			data: {
				stats: [
					{ label: "Пользователи", value: usersCount },
					{ label: "Партнеры", value: partnersCount },
					{ label: "Туры", value: tours.length },
					{ label: "Отели", value: hotels.length },
					{ label: "Брони туров", value: bookingStats.total },
					{ label: "Заявки на отели", value: requestStats.total },
				],
				bookings: bookingStats,
				hotelRequests: requestStats,
				revenue: {
					totalTourRevenue: bookingStats.revenue,
					moneyAmount: bookingStats.moneyAmount,
					bonusAmount: bookingStats.bonusAmount,
				},
				payments: {
					moneyAmount: bookingStats.moneyAmount,
					bonusAmount: bookingStats.bonusAmount,
					totalAmount: paymentTotal,
					moneyPercent: paymentTotal ? Math.round((bookingStats.moneyAmount / paymentTotal) * 100) : 0,
					bonusPercent: paymentTotal ? Math.round((bookingStats.bonusAmount / paymentTotal) * 100) : 0,
				},
				charts: {
					timeline: Array.from(timelineMap.values()),
					bookingStatuses: [
						{ label: "Активные", value: bookingStats.active },
						{ label: "Завершенные", value: bookingStats.completed },
						{ label: "Отмененные", value: bookingStats.cancelled },
					],
					requestStatuses: [
						{ label: "Новые", value: requestStats.new },
						{ label: "В работе", value: requestStats.in_progress },
						{ label: "Связались", value: requestStats.contacted },
						{ label: "Закрыто", value: requestStats.closed },
						{ label: "Отменено", value: requestStats.cancelled },
					],
					payments: [
						{ label: "Деньгами", value: bookingStats.moneyAmount },
						{ label: "Бонусами", value: bookingStats.bonusAmount },
					],
					topTours: Array.from(tourPerformance.values()).sort((a, b) => b.revenue - a.revenue || b.views - a.views).slice(0, 8),
					topHotels: Array.from(hotelPerformance.values()).sort((a, b) => b.requests - a.requests || b.views - a.views).slice(0, 8),
				},
				recentBookings,
				recentRequests: recentRequests.slice(0, 8),
			},
		})
	} catch (error) {
		console.error("Get dashboard summary error:", error)
		return res.status(500).json({ message: "Failed to get dashboard summary" })
	}
}
