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

		const doc = new HotelModel({
			name: req.body.name,
			partner: partnerId,
			description: req.body.description,
			rating: req.body.rating,
			images: req.body.images,
			location: req.body.location,
			content: req.body.content,
		})

		const hotel = await doc.save()
		await PartnerModel.findByIdAndUpdate(partnerId, {
			$addToSet: { hotels: hotel._id },
		})
		res.json({ data: hotel })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Ошибка при создании отеля",
		})
	}
}
