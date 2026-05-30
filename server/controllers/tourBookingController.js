import mongoose from "mongoose"
import TourModel from "../models/Tour.js"
import UserModel from "../models/User.js"

const allowedStatuses = ["active", "completed", "cancelled"]

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const createHttpError = (statusCode, message) => {
	const error = new Error(message)
	error.statusCode = statusCode
	return error
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

const serializeBooking = (booking, user = null) => {
	const source = typeof booking?.toObject === "function" ? booking.toObject() : booking

	return {
		...source,
		status: deriveBookingStatus(source),
		...(user
			? {
				customer: {
					_id: user._id,
					name: user.name,
					email: user.email,
					phone: user.phone,
				},
			}
			: {}),
	}
}

const refundCancelledBooking = ({ booking, user, tour }) => {
	const refundAmount = Math.max(0, Number(booking?.total) || 0)
	const refundedBonuses = Math.max(0, Number(booking?.paidWithBonuses) || 0)
	const accruedBonusRollback =
		normalizeString(booking?.paymentMethod) === "bonus"
			? 0
			: Math.max(0, Math.floor(refundAmount * 0.05))
	const bookingLabel = normalizeString(tour?.title) || "Бронирование тура"
	const bookingDateLabel = normalizeString(booking?.date) || "без даты"

	if (refundAmount > 0) {
		user.walletTransactions.unshift({
			name: bookingLabel,
			type: "Возврат",
			amount: refundAmount,
			currency: "KZT",
			note: `Возврат по отмене бронирования (${bookingDateLabel})`,
		})
	}

	if (refundedBonuses > 0) {
		user.bonusBalance = Math.max(0, Number(user.bonusBalance) || 0) + refundedBonuses
		user.walletTransactions.unshift({
			name: bookingLabel,
			type: "Бонусы",
			amount: refundedBonuses,
			currency: "BONUS",
			note: "Возврат бонусов при отмене бронирования",
		})
	}

	if (accruedBonusRollback > 0) {
		user.bonusBalance = Math.max(
			0,
			Math.max(0, Number(user.bonusBalance) || 0) - accruedBonusRollback
		)
		user.walletTransactions.unshift({
			name: bookingLabel,
			type: "Бонусы",
			amount: -accruedBonusRollback,
			currency: "BONUS",
			note: "Отмена ранее начисленных бонусов за бронирование",
		})
	}
}

const applyCancellationDetails = (booking, payload = {}) => {
	booking.cancellationReason = normalizeString(payload.refundReason)
	booking.cancellationReasonLabel = normalizeString(payload.refundReasonLabel)
	booking.cancellationComment = normalizeString(payload.refundComment)
	booking.cancelledAt = new Date()
}

const getManagedTourFilter = async (req) => {
	if (req.userRole === "admin") {
		return null
	}

	if (req.userRole === "partner") {
		const tours = await TourModel.find({ partner: req.partnerId }).select("_id")
		return new Set(tours.map((item) => String(item._id)))
	}

	return new Set()
}

const getManagedBookingsList = async (req, statusQuery = "") => {
	const allowedTourIds = await getManagedTourFilter(req)

	const users = await UserModel.find({ "tourBookings.0": { $exists: true } })
		.sort({ updatedAt: -1 })
		.select("name email phone tourBookings")
		.populate({
			path: "tourBookings.tour",
			populate: { path: "partner" },
		})

	return users
		.flatMap((user) => {
			const items = Array.isArray(user.tourBookings) ? user.tourBookings : []

			return items
				.filter((booking) => booking?.tour)
				.filter((booking) => {
					if (!allowedTourIds) return true
					return allowedTourIds.has(String(booking.tour?._id || booking.tour))
				})
				.map((booking) => serializeBooking(booking, user))
		})
		.filter((booking) => {
			if (!statusQuery) return true
			return booking.status === statusQuery
		})
		.sort(
			(left, right) =>
				new Date(right.createdAt || 0).getTime() -
				new Date(left.createdAt || 0).getTime()
		)
}

const groupBookingsByTour = (bookings) => {
	const map = new Map()

	for (const booking of bookings) {
		const tour = booking?.tour
		const tourId = String(tour?._id || tour || "")
		if (!tourId) continue

		if (!map.has(tourId)) {
			map.set(tourId, {
				_id: tourId,
				tour,
				bookings: [],
				bookingCount: 0,
				activeCount: 0,
				completedCount: 0,
				cancelledCount: 0,
				guestsCount: 0,
				totalAmount: 0,
				lastBookingAt: null,
			})
		}

		const group = map.get(tourId)
		group.bookings.push(booking)
		group.bookingCount += 1
		group.guestsCount += Number(booking?.guests) || 0
		group.totalAmount += Number(booking?.total) || 0
		if (booking.status === "completed") group.completedCount += 1
		else if (booking.status === "cancelled") group.cancelledCount += 1
		else group.activeCount += 1

		const createdAt = booking?.createdAt ? new Date(booking.createdAt) : null
		if (createdAt && !Number.isNaN(createdAt.getTime())) {
			const current = group.lastBookingAt ? new Date(group.lastBookingAt) : null
			if (!current || createdAt.getTime() > current.getTime()) {
				group.lastBookingAt = createdAt.toISOString()
			}
		}
	}

	return Array.from(map.values()).sort(
		(left, right) =>
			new Date(right.lastBookingAt || 0).getTime() -
			new Date(left.lastBookingAt || 0).getTime()
	)
}

export const getManagedTourBookings = async (req, res) => {
	try {
		const statusQuery = normalizeString(req.query.status)
		const grouped = normalizeString(req.query.grouped) === "true"
		const bookings = await getManagedBookingsList(req, statusQuery)

		return res.json({
			data: grouped ? groupBookingsByTour(bookings) : bookings,
			meta: { grouped },
		})
	} catch (error) {
		console.error("Get managed tour bookings error:", error)
		return res.status(500).json({ message: "Не удалось получить бронирования туров" })
	}
}

export const getManagedTourBookingGroup = async (req, res) => {
	try {
		const tourId = normalizeString(req.params.tourId)
		const statusQuery = normalizeString(req.query.status)

		if (!mongoose.Types.ObjectId.isValid(tourId)) {
			return res.status(400).json({ message: "Некорректный тур" })
		}

		const bookings = await getManagedBookingsList(req, statusQuery)
		const group = groupBookingsByTour(bookings).find((item) => item._id === tourId)

		if (!group) {
			const tour = await TourModel.findById(tourId).populate("partner")
			if (!tour) return res.status(404).json({ message: "Тур не найден" })

			if (req.userRole === "partner" && String(tour.partner?._id || tour.partner) !== String(req.partnerId)) {
				return res.status(403).json({ message: "Недостаточно прав" })
			}

			return res.json({
				data: {
					_id: tourId,
					tour,
					bookings: [],
					bookingCount: 0,
					activeCount: 0,
					completedCount: 0,
					cancelledCount: 0,
					guestsCount: 0,
					totalAmount: 0,
					lastBookingAt: null,
				},
			})
		}

		return res.json({ data: group })
	} catch (error) {
		console.error("Get managed tour booking group error:", error)
		return res.status(500).json({ message: "Не удалось получить данные тура" })
	}
}

export const updateManagedTourBookingStatus = async (req, res) => {
	const session = await mongoose.startSession()

	try {
		const nextStatus = normalizeString(req.body.status)

		if (!allowedStatuses.includes(nextStatus)) {
			return res.status(400).json({ message: "Некорректный статус" })
		}

		await session.withTransaction(async () => {
			const user = await UserModel.findOne({
				"tourBookings._id": req.params.bookingId,
			}).session(session)

			if (!user) {
				throw createHttpError(404, "Бронирование не найдено")
			}

			const booking = user.tourBookings.id(req.params.bookingId)

			if (!booking) {
				throw createHttpError(404, "Бронирование не найдено")
			}

			const tour = await TourModel.findById(booking.tour).session(session)

			if (!tour) {
				throw createHttpError(404, "Тур не найден")
			}

			if (
				req.userRole === "partner" &&
				String(tour.partner) !== String(req.partnerId)
			) {
				throw createHttpError(403, "Недостаточно прав")
			}

			if (booking.status === "cancelled" && nextStatus !== "cancelled") {
				throw createHttpError(409, "Отмененное бронирование нельзя открыть повторно")
			}

			if (booking.status === "completed" && nextStatus !== "completed") {
				throw createHttpError(409, "Завершенное бронирование нельзя изменить")
			}

			if (booking.status === nextStatus) {
				return
			}

			if (nextStatus === "cancelled") {
				const slot = booking.availabilityDateId
					? tour.availabilityDates.id(booking.availabilityDateId)
					: null

				if (slot) {
					slot.bookedSeats = Math.max(
						0,
						(Number(slot.bookedSeats) || 0) - (Number(booking.guests) || 0)
					)
				}

				refundCancelledBooking({ booking, user, tour })
				applyCancellationDetails(booking, req.body)
			}

			booking.status = nextStatus

			await user.save({ session })
			await tour.save({ session })
		})

		const latestUser = await UserModel.findOne({
			"tourBookings._id": req.params.bookingId,
		})
			.select("name email phone tourBookings")
			.populate({
				path: "tourBookings.tour",
				populate: { path: "partner" },
			})

		const latestBooking = latestUser?.tourBookings?.id(req.params.bookingId)

		return res.json({
			message: "Статус бронирования обновлен",
			data: latestBooking ? serializeBooking(latestBooking, latestUser) : null,
		})
	} catch (error) {
		console.error("Update managed tour booking status error:", error)
		return res.status(error.statusCode || 500).json({
			message: error.message || "Не удалось обновить статус бронирования",
		})
	} finally {
		await session.endSession()
	}
}

export const cancelOwnTourBooking = async (req, res) => {
	const session = await mongoose.startSession()

	try {
		await session.withTransaction(async () => {
			const user = await UserModel.findById(req.userId).session(session)

			if (!user) {
				throw createHttpError(404, "Пользователь не найден")
			}

			const booking = user.tourBookings.id(req.params.bookingId)

			if (!booking) {
				throw createHttpError(404, "Бронирование не найдено")
			}

			if (deriveBookingStatus(booking) !== "active") {
				throw createHttpError(409, "Можно отменить только активное бронирование")
			}

			const tour = await TourModel.findById(booking.tour).session(session)

			if (!tour) {
				throw createHttpError(404, "Тур не найден")
			}

			const slot = booking.availabilityDateId
				? tour.availabilityDates.id(booking.availabilityDateId)
				: null

			if (slot) {
				slot.bookedSeats = Math.max(
					0,
					(Number(slot.bookedSeats) || 0) - (Number(booking.guests) || 0)
				)
			}

			refundCancelledBooking({ booking, user, tour })
			applyCancellationDetails(booking, req.body)
			booking.status = "cancelled"

			await tour.save({ session })
			await user.save({ session })
		})

		const latestUser = await UserModel.findById(req.userId)
			.select("name email phone tourBookings")
			.populate({
				path: "tourBookings.tour",
				populate: { path: "partner" },
			})

		const latestBooking = latestUser?.tourBookings?.id(req.params.bookingId)

		return res.json({
			message: "Бронирование отменено",
			data: latestBooking ? serializeBooking(latestBooking, latestUser) : null,
		})
	} catch (error) {
		console.error("Cancel own tour booking error:", error)
		return res.status(error.statusCode || 500).json({
			message: error.message || "Не удалось отменить бронирование",
		})
	} finally {
		await session.endSession()
	}
}
