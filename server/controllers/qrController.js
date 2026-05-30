import mongoose from "mongoose"
import HotelRequestModel from "../models/HotelRequest.js"
import UserModel from "../models/User.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(normalizeString(value))

const parseDateValue = (value) => {
	const text = normalizeString(value)
	if (!text) return null

	const parsed = /^\d{4}-\d{2}-\d{2}$/.test(text)
		? new Date(`${text}T00:00:00`)
		: new Date(text)

	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const deriveTourBookingStatus = (booking) => {
	const currentStatus = normalizeString(booking?.status) || "active"
	if (currentStatus !== "active") return currentStatus

	const parsedDate = parseDateValue(booking?.date)
	if (!parsedDate) return currentStatus

	return parsedDate.getTime() < Date.now() - 24 * 60 * 60 * 1000
		? "completed"
		: currentStatus
}

const serializeCustomer = (user) => ({
	_id: user?._id,
	name: user?.name || "",
	email: user?.email || "",
	phone: user?.phone || "",
})

const serializeTourBooking = (booking, user) => {
	const source = typeof booking?.toObject === "function" ? booking.toObject() : booking
	return {
		...source,
		status: deriveTourBookingStatus(source),
		customer: serializeCustomer(user),
		verifiedAt: new Date().toISOString(),
	}
}

export const verifyTourQr = async (req, res) => {
	try {
		const hash = normalizeString(req.params.hash)

		if (!isObjectId(hash)) {
			return res.status(400).json({ message: "Некорректный QR-код билета" })
		}

		const user = await UserModel.findOne({ "tourBookings._id": hash })
			.select("name email phone tourBookings")
			.populate({
				path: "tourBookings.tour",
				populate: { path: "partner" },
			})

		const booking = user?.tourBookings?.id(hash)

		if (!user || !booking) {
			return res.status(404).json({ message: "Билет по этому QR-коду не найден" })
		}

		return res.json({
			data: {
				type: "tour",
				isValid: true,
				booking: serializeTourBooking(booking, user),
			},
		})
	} catch (error) {
		console.error("Verify tour QR error:", error)
		return res.status(500).json({ message: "Не удалось проверить QR-код билета" })
	}
}

export const verifyHotelQr = async (req, res) => {
	try {
		const hash = normalizeString(req.params.hash)

		if (!isObjectId(hash)) {
			return res.status(400).json({ message: "Некорректный QR-код брони" })
		}

		const request = await HotelRequestModel.findById(hash)
			.populate("hotel")
			.populate("partner")
			.populate({ path: "createdBy", select: "name email phone" })

		if (!request) {
			return res.status(404).json({ message: "Бронь отеля по этому QR-коду не найдена" })
		}

		return res.json({
			data: {
				type: "hotel",
				isValid: true,
				booking: {
					...request.toObject(),
					customer: request.createdBy
						? serializeCustomer(request.createdBy)
						: {
							name: request.name,
							email: request.email,
							phone: request.phone,
						},
					verifiedAt: new Date().toISOString(),
				},
			},
		})
	} catch (error) {
		console.error("Verify hotel QR error:", error)
		return res.status(500).json({ message: "Не удалось проверить QR-код брони" })
	}
}
