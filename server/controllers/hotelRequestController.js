import HotelModel from "../models/Hotel.js"
import HotelRequestModel from "../models/HotelRequest.js"

const allowedRequestStatuses = [
	"new",
	"in_progress",
	"contacted",
	"closed",
	"cancelled",
]

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const normalizePhone = (value) => {
	const digits = normalizeString(value).replace(/\D/g, "")
	return digits || ""
}

const normalizeDate = (value) => {
	const normalized = normalizeString(value)

	if (!normalized) {
		return null
	}

	return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null
}

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email)

export const createHotelRequest = async (req, res) => {
	try {
		const hotelId = normalizeString(req.body.hotelId || req.body.hotel)
		const name = normalizeString(req.body.name)
		const phone = normalizePhone(req.body.phone)
		const email = normalizeString(req.body.email).toLowerCase() || null
		const checkIn = normalizeDate(req.body.checkIn)
		const checkOut = normalizeDate(req.body.checkOut)
		const guests = Math.max(1, Number(req.body.guests) || 1)
		const comment = normalizeString(req.body.comment)

		if (!hotelId) {
			return res.status(400).json({ message: "Hotel is required" })
		}

		if (!name) {
			return res.status(400).json({ message: "Name is required" })
		}

		if (!phone) {
			return res.status(400).json({ message: "Phone is required" })
		}

		if (email && !isValidEmail(email)) {
			return res.status(400).json({ message: "Email is invalid" })
		}

		if (checkIn && checkOut && checkOut < checkIn) {
			return res.status(400).json({
				message: "Check-out date must be greater than or equal to check-in date",
			})
		}

		const hotel = await HotelModel.findById(hotelId).select("name partner")

		if (!hotel) {
			return res.status(404).json({ message: "Hotel was not found" })
		}

		const request = await HotelRequestModel.create({
			hotel: hotel._id,
			partner: hotel.partner,
			createdBy: req.userId || null,
			name,
			phone,
			email,
			checkIn,
			checkOut,
			guests,
			comment,
			status: "new",
			source: "website",
		})

		return res.status(201).json({
			message: "Hotel request created",
			data: {
				_id: request._id,
				status: request.status,
				hotel: {
					_id: hotel._id,
					name: hotel.name,
				},
			},
		})
	} catch (error) {
		console.error("Create hotel request error:", error)
		return res.status(500).json({ message: "Failed to create hotel request" })
	}
}

export const getManagedHotelRequests = async (req, res) => {
	try {
		const filter = {}
		const status = normalizeString(req.query.status)
		const hotelId = normalizeString(req.query.hotelId)

		if (req.userRole === "partner") {
			filter.partner = req.partnerId
		}

		if (status && allowedRequestStatuses.includes(status)) {
			filter.status = status
		}

		if (hotelId) {
			filter.hotel = hotelId
		}

		const requests = await HotelRequestModel.find(filter)
			.sort({ createdAt: -1 })
			.populate("hotel")
			.populate("partner")
			.populate({
				path: "createdBy",
				select: "name email phone",
			})

		return res.json({ data: requests })
	} catch (error) {
		console.error("Get managed hotel requests error:", error)
		return res.status(500).json({ message: "Failed to get hotel requests" })
	}
}

export const updateHotelRequestStatus = async (req, res) => {
	try {
		const status = normalizeString(req.body.status)
		const managerNote = normalizeString(req.body.managerNote)

		if (!allowedRequestStatuses.includes(status)) {
			return res.status(400).json({ message: "Status is invalid" })
		}

		const request = await HotelRequestModel.findById(req.params.id)

		if (!request) {
			return res.status(404).json({ message: "Hotel request was not found" })
		}

		if (
			req.userRole === "partner" &&
			String(request.partner) !== String(req.partnerId)
		) {
			return res.status(403).json({ message: "Forbidden" })
		}

		request.status = status

		if (Object.prototype.hasOwnProperty.call(req.body, "managerNote")) {
			request.managerNote = managerNote
		}

		await request.save()

		const updatedRequest = await HotelRequestModel.findById(request._id)
			.populate("hotel")
			.populate("partner")
			.populate({
				path: "createdBy",
				select: "name email phone",
			})

		return res.json({
			message: "Hotel request updated",
			data: updatedRequest,
		})
	} catch (error) {
		console.error("Update hotel request status error:", error)
		return res.status(500).json({ message: "Failed to update hotel request" })
	}
}