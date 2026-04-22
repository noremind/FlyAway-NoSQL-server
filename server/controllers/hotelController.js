import HotelModel from "../models/Hotel.js"
import PartnerModel from "../models/Partner.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const escapeRegExp = (value) =>
	String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const normalizeQueryDate = (value) => {
	const normalized = normalizeString(value)

	if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
		return ""
	}

	return normalized
}

const normalizeImages = (value) =>
	Array.isArray(value)
		? value.map((item) => normalizeString(item)).filter(Boolean)
		: []

const canManageHotel = (req, hotel) => {
	if (req.userRole === "admin") return true
	return req.partnerId && String(hotel.partner) === String(req.partnerId)
}

const buildHotelPayload = (body, partnerId, currentHotel = null) => {
	const currentData = currentHotel?.toObject ? currentHotel.toObject() : currentHotel || {}

	return {
		name: Object.prototype.hasOwnProperty.call(body, "name")
			? normalizeString(body.name)
			: normalizeString(currentData.name),
		partner: partnerId,
		description: Object.prototype.hasOwnProperty.call(body, "description")
			? normalizeString(body.description)
			: normalizeString(currentData.description),
		rating: Object.prototype.hasOwnProperty.call(body, "rating")
			? Number(body.rating) || 0
			: Number(currentData.rating) || 0,
		images: Object.prototype.hasOwnProperty.call(body, "images")
			? normalizeImages(body.images)
			: normalizeImages(currentData.images),
		location: Object.prototype.hasOwnProperty.call(body, "location")
			? normalizeString(body.location)
			: normalizeString(currentData.location),
		content: Object.prototype.hasOwnProperty.call(body, "content")
			? normalizeString(body.content)
			: normalizeString(currentData.content),
	}
}

export const getHotels = async (req, res) => {
	try {
		const search = normalizeString(req.query.search)
		const checkIn = normalizeQueryDate(req.query.checkIn)
		const checkOut = normalizeQueryDate(req.query.checkOut)
		const query = {}

		if (search) {
			const regex = new RegExp(escapeRegExp(search), "i")

			query.$or = [
				{ name: regex },
				{ description: regex },
				{ location: regex },
				{ content: regex },
			]
		}

		const hotels = await HotelModel.find(query)
			.sort({ createdAt: -1 })
			.populate("partner")

		res.json({
			data: hotels,
			meta: {
				filters: {
					search,
					checkIn: checkIn || null,
					checkOut: checkOut || null,
				},
			},
		})
	} catch (error) {
		console.error("❌ Ошибка получения отелей:", error)
		res.status(500).json({
			message: "Ошибка при получении отелей",
		})
	}
}

export const getManagedHotels = async (req, res) => {
	try {
		const filter = req.userRole === "partner" ? { partner: req.partnerId } : {}
		const hotels = await HotelModel.find(filter)
			.sort({ updatedAt: -1 })
			.populate("partner")
		res.json({ data: hotels })
	} catch (error) {
		console.error("❌ Ошибка получения управляемых отелей:", error)
		res.status(500).json({
			message: "Ошибка при получении отелей",
		})
	}
}

export const getOneHotel = async (req, res) => {
	try {
		const hotel = await HotelModel.findById(req.params.id).populate("partner")

		if (!hotel) {
			return res.status(404).json({
				message: "Отель не найден",
			})
		}

		const { createdAt, updatedAt, __v, ...hotelData } = hotel._doc

		res.json({
			data: { ...hotelData },
		})
	} catch (error) {
		console.error("Ошибка при получении отеля:", error)
		res.status(500).json({
			message: "Ошибка при получении отеля",
		})
	}
}

export const createHotel = async (req, res) => {
	try {
		const partnerId = req.userRole === "partner" ? req.partnerId : req.body.partner

		if (!partnerId) {
			return res.status(400).json({ message: "Партнер для отеля обязателен" })
		}

		const partner = await PartnerModel.findById(partnerId)

		if (!partner) {
			return res.status(404).json({ message: "Партнер не найден" })
		}

		const payload = buildHotelPayload(req.body, partnerId)

		if (!payload.name || !payload.location || !payload.description || !payload.content) {
			return res.status(400).json({
				message: "Название, локация, описание и контент обязательны",
			})
		}

		const doc = new HotelModel(payload)
		const hotel = await doc.save()
		await PartnerModel.findByIdAndUpdate(partnerId, {
			$addToSet: { hotels: hotel._id },
		})
		const savedHotel = await HotelModel.findById(hotel._id).populate("partner")
		res.json({ data: savedHotel })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Ошибка при создании отеля",
		})
	}
}

export const updateHotel = async (req, res) => {
	try {
		const hotel = await HotelModel.findById(req.params.id)

		if (!hotel) {
			return res.status(404).json({ message: "Отель не найден" })
		}

		if (!canManageHotel(req, hotel)) {
			return res.status(403).json({ message: "Нет доступа к редактированию отеля" })
		}

		const currentPartnerId = String(hotel.partner)
		const nextPartnerId =
			req.userRole === "partner"
				? req.partnerId
				: normalizeString(req.body.partner) || currentPartnerId

		const partner = await PartnerModel.findById(nextPartnerId)

		if (!partner) {
			return res.status(404).json({ message: "Партнер не найден" })
		}

		const payload = buildHotelPayload(req.body, nextPartnerId, hotel)

		if (!payload.name || !payload.location || !payload.description || !payload.content) {
			return res.status(400).json({
				message: "Название, локация, описание и контент обязательны",
			})
		}

		Object.assign(hotel, payload)
		await hotel.save()

		if (currentPartnerId !== String(nextPartnerId)) {
			await PartnerModel.findByIdAndUpdate(currentPartnerId, {
				$pull: { hotels: hotel._id },
			})
		}

		await PartnerModel.findByIdAndUpdate(nextPartnerId, {
			$addToSet: { hotels: hotel._id },
		})

		const updatedHotel = await HotelModel.findById(hotel._id).populate("partner")
		return res.json({
			message: "Отель обновлен",
			data: updatedHotel,
		})
	} catch (error) {
		console.error("Ошибка при обновлении отеля:", error)
		return res.status(500).json({
			message: "Ошибка при обновлении отеля",
		})
	}
}

export const deleteHotel = async (req, res) => {
	try {
		const hotel = await HotelModel.findById(req.params.id)

		if (!hotel) {
			return res.status(404).json({ message: "Отель не найден" })
		}

		if (!canManageHotel(req, hotel)) {
			return res.status(403).json({ message: "Нет доступа к удалению отеля" })
		}

		await HotelModel.deleteOne({ _id: hotel._id })
		await PartnerModel.findByIdAndUpdate(hotel.partner, {
			$pull: { hotels: hotel._id },
		})

		return res.json({ message: "Отель удален" })
	} catch (error) {
		console.error("Ошибка при удалении отеля:", error)
		return res.status(500).json({
			message: "Ошибка при удалении отеля",
		})
	}
}
