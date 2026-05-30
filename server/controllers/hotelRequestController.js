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

const buildHotelRequestFilter = (req) => {
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

	return filter
}

const findManagedHotelRequests = async (req) => {
	const filter = buildHotelRequestFilter(req)

	return HotelRequestModel.find(filter)
		.sort({ createdAt: -1 })
		.populate("hotel")
		.populate("partner")
		.populate({
			path: "createdBy",
			select: "name email phone",
		})
}

const groupRequestsByHotel = (requests) => {
	const map = new Map()

	for (const request of requests) {
		const source = typeof request?.toObject === "function" ? request.toObject() : request
		const hotel = source?.hotel
		const hotelId = String(hotel?._id || hotel || "")
		if (!hotelId) continue

		if (!map.has(hotelId)) {
			map.set(hotelId, {
				_id: hotelId,
				hotel,
				partner: source.partner || hotel?.partner || null,
				requests: [],
				requestCount: 0,
				newCount: 0,
				inProgressCount: 0,
				contactedCount: 0,
				closedCount: 0,
				cancelledCount: 0,
				guestsCount: 0,
				lastRequestAt: null,
			})
		}

		const group = map.get(hotelId)
		group.requests.push(source)
		group.requestCount += 1
		group.guestsCount += Number(source?.guests) || 0
		if (source.status === "in_progress") group.inProgressCount += 1
		else if (source.status === "contacted") group.contactedCount += 1
		else if (source.status === "closed") group.closedCount += 1
		else if (source.status === "cancelled") group.cancelledCount += 1
		else group.newCount += 1

		const createdAt = source?.createdAt ? new Date(source.createdAt) : null
		if (createdAt && !Number.isNaN(createdAt.getTime())) {
			const current = group.lastRequestAt ? new Date(group.lastRequestAt) : null
			if (!current || createdAt.getTime() > current.getTime()) {
				group.lastRequestAt = createdAt.toISOString()
			}
		}
	}

	return Array.from(map.values()).sort(
		(left, right) =>
			new Date(right.lastRequestAt || 0).getTime() -
			new Date(left.lastRequestAt || 0).getTime()
	)
}

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
			return res.status(400).json({ message: "Выберите отель" })
		}

		if (!name) {
			return res.status(400).json({ message: "Введите имя" })
		}

		if (!phone) {
			return res.status(400).json({ message: "Введите телефон" })
		}

		if (email && !isValidEmail(email)) {
			return res.status(400).json({ message: "Некорректная почта" })
		}

		if (checkIn && checkOut && checkOut < checkIn) {
			return res.status(400).json({
				message: "Дата выезда должна быть позже даты заезда",
			})
		}

		const hotel = await HotelModel.findById(hotelId).select("name partner")

		if (!hotel) {
			return res.status(404).json({ message: "Отель не найден" })
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
			message: "Заявка на отель создана",
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
		return res.status(500).json({ message: "Не удалось создать заявку на отель" })
	}
}

export const getManagedHotelRequests = async (req, res) => {
	try {
		const grouped = normalizeString(req.query.grouped) === "true"
		const requests = await findManagedHotelRequests(req)
		return res.json({ data: grouped ? groupRequestsByHotel(requests) : requests, meta: { grouped } })
	} catch (error) {
		console.error("Get managed hotel requests error:", error)
		return res.status(500).json({ message: "Не удалось получить заявки на отели" })
	}
}

export const getManagedHotelRequestGroup = async (req, res) => {
	try {
		const hotelId = normalizeString(req.params.hotelId)

		if (!hotelId) {
			return res.status(400).json({ message: "Некорректный отель" })
		}

		const requests = await findManagedHotelRequests(req)
		const group = groupRequestsByHotel(requests).find((item) => item._id === hotelId)

		if (!group) {
			const hotel = await HotelModel.findById(hotelId).populate("partner")
			if (!hotel) return res.status(404).json({ message: "Отель не найден" })

			if (req.userRole === "partner" && String(hotel.partner?._id || hotel.partner) !== String(req.partnerId)) {
				return res.status(403).json({ message: "Недостаточно прав" })
			}

			return res.json({
				data: {
					_id: hotelId,
					hotel,
					partner: hotel.partner,
					requests: [],
					requestCount: 0,
					newCount: 0,
					inProgressCount: 0,
					contactedCount: 0,
					closedCount: 0,
					cancelledCount: 0,
					guestsCount: 0,
					lastRequestAt: null,
				},
			})
		}

		return res.json({ data: group })
	} catch (error) {
		console.error("Get managed hotel request group error:", error)
		return res.status(500).json({ message: "Не удалось получить данные отеля" })
	}
}

export const updateHotelRequestStatus = async (req, res) => {
	try {
		const status = normalizeString(req.body.status)
		const managerNote = normalizeString(req.body.managerNote)

		if (!allowedRequestStatuses.includes(status)) {
			return res.status(400).json({ message: "Некорректный статус" })
		}

		const request = await HotelRequestModel.findById(req.params.id)

		if (!request) {
			return res.status(404).json({ message: "Заявка на отель не найдена" })
		}

		if (
			req.userRole === "partner" &&
			String(request.partner) !== String(req.partnerId)
		) {
			return res.status(403).json({ message: "Недостаточно прав" })
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
			message: "Заявка обновлена",
			data: updatedRequest,
		})
	} catch (error) {
		console.error("Update hotel request status error:", error)
		return res.status(500).json({ message: "Не удалось обновить заявку" })
	}
}
