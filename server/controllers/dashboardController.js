import TourModel from "../models/Tour.js"
import HotelModel from "../models/Hotel.js"
import PartnerModel from "../models/Partner.js"
import UserModel from "../models/User.js"
import HotelRequestModel from "../models/HotelRequest.js"

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

const deriveBookingStatus = (booking) => {
	const currentStatus = normalizeString(booking?.status) || "active"

	if (currentStatus !== "active") {
		return currentStatus
	}

	const parsedDate = parseBookingDate(booking?.date)

	if (!parsedDate) {
		return currentStatus
	}

	return parsedDate.getTime() < Date.now() - 24 * 60 * 60 * 1000
		? "completed"
		: currentStatus
}

const getEmptyBookingStats = () => ({
	total: 0,
	active: 0,
	completed: 0,
	cancelled: 0,
	revenue: 0,
})

const getEmptyRequestStats = () => ({
	total: 0,
	new: 0,
	in_progress: 0,
	contacted: 0,
	closed: 0,
	cancelled: 0,
})

export const getDashboardSummary = async (req, res) => {
	try {
		const isPartner = req.userRole === "partner"
		const partnerFilter = isPartner ? { partner: req.partnerId } : {}

		const [usersCount, partnersCount, tours, hotels, requests, bookingUsers] =
			await Promise.all([
				isPartner ? Promise.resolve(0) : UserModel.countDocuments(),
				isPartner ? Promise.resolve(1) : PartnerModel.countDocuments(),
				TourModel.find(partnerFilter)
					.select("title partner createdAt")
					.sort({ createdAt: -1 }),
				HotelModel.find(partnerFilter)
					.select("name partner createdAt")
					.sort({ createdAt: -1 }),
				HotelRequestModel.find(isPartner ? { partner: req.partnerId } : {})
					.populate("hotel")
					.sort({ createdAt: -1 })
					.limit(8),
				UserModel.find({ "tourBookings.0": { $exists: true } })
					.select("name email phone tourBookings")
					.populate({
						path: "tourBookings.tour",
						select: "title partner",
						populate: { path: "partner", select: "title" },
					}),
			])

		const allowedTourIds = new Set(tours.map((item) => String(item._id)))

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

						bookingStats.total += 1
						bookingStats[status] += 1
						bookingStats.revenue += Math.max(0, Number(booking?.total) || 0)

						return {
							_id: booking._id,
							status,
							date: booking.date,
							total: Number(booking?.total) || 0,
							guests: Number(booking?.guests) || 0,
							paymentMethod: booking?.paymentMethod || "card",
							createdAt: booking?.createdAt || user.updatedAt || user.createdAt,
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

		for (const request of requests) {
			const status = normalizeString(request?.status) || "new"

			requestStats.total += 1

			if (Object.prototype.hasOwnProperty.call(requestStats, status)) {
				requestStats[status] += 1
			}
		}

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
				},
				recentBookings,
				recentRequests: requests.slice(0, 8),
			},
		})
	} catch (error) {
		console.error("Get dashboard summary error:", error)
		return res.status(500).json({ message: "Failed to get dashboard summary" })
	}
}