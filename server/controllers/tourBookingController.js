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

export const getManagedTourBookings = async (req, res) => {
	try {
		const statusQuery = normalizeString(req.query.status)
		const allowedTourIds = await getManagedTourFilter(req)

		const users = await UserModel.find({ "tourBookings.0": { $exists: true } })
			.sort({ updatedAt: -1 })
			.select("name email phone tourBookings")
			.populate({
				path: "tourBookings.tour",
				populate: { path: "partner" },
			})

		const bookings = users
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

		return res.json({ data: bookings })
	} catch (error) {
		console.error("Get managed tour bookings error:", error)
		return res.status(500).json({ message: "Failed to get tour bookings" })
	}
}

export const updateManagedTourBookingStatus = async (req, res) => {
	const session = await mongoose.startSession()

	try {
		const nextStatus = normalizeString(req.body.status)

		if (!allowedStatuses.includes(nextStatus)) {
			return res.status(400).json({ message: "Status is invalid" })
		}

		await session.withTransaction(async () => {
			const user = await UserModel.findOne({
				"tourBookings._id": req.params.bookingId,
			}).session(session)

			if (!user) {
				throw createHttpError(404, "Booking was not found")
			}

			const booking = user.tourBookings.id(req.params.bookingId)

			if (!booking) {
				throw createHttpError(404, "Booking was not found")
			}

			const tour = await TourModel.findById(booking.tour).session(session)

			if (!tour) {
				throw createHttpError(404, "Tour was not found")
			}

			if (
				req.userRole === "partner" &&
				String(tour.partner) !== String(req.partnerId)
			) {
				throw createHttpError(403, "Forbidden")
			}

			if (booking.status === "cancelled" && nextStatus !== "cancelled") {
				throw createHttpError(409, "Cancelled booking cannot be reopened")
			}

			if (booking.status === "completed" && nextStatus !== "completed") {
				throw createHttpError(409, "Completed booking cannot be changed")
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
			message: "Booking status updated",
			data: latestBooking ? serializeBooking(latestBooking, latestUser) : null,
		})
	} catch (error) {
		console.error("Update managed tour booking status error:", error)
		return res.status(error.statusCode || 500).json({
			message: error.message || "Failed to update booking status",
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
				throw createHttpError(404, "User was not found")
			}

			const booking = user.tourBookings.id(req.params.bookingId)

			if (!booking) {
				throw createHttpError(404, "Booking was not found")
			}

			if (booking.status !== "active") {
				throw createHttpError(409, "Only active booking can be cancelled")
			}

			const tour = await TourModel.findById(booking.tour).session(session)

			if (!tour) {
				throw createHttpError(404, "Tour was not found")
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
			message: "Booking cancelled",
			data: latestBooking ? serializeBooking(latestBooking, latestUser) : null,
		})
	} catch (error) {
		console.error("Cancel own tour booking error:", error)
		return res.status(error.statusCode || 500).json({
			message: error.message || "Failed to cancel booking",
		})
	} finally {
		await session.endSession()
	}
}