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

const normalizeNumber = (value, fallback = 0) => {
	const number = Number(value)
	return Number.isFinite(number) ? number : fallback
}

const normalizeImages = (value) =>
	Array.isArray(value)
		? value.map((item) => normalizeString(item)).filter(Boolean)
		: []

const normalizeStringList = (value) => {
	if (Array.isArray(value)) {
		return value.map((item) => normalizeString(item)).filter(Boolean)
	}

	if (typeof value === "string") {
		return value
			.split(/\n|;|,/)
			.map((item) => normalizeString(item))
			.filter(Boolean)
	}

	return []
}

const normalizeRoomTypes = (value) => {
	if (!Array.isArray(value)) return []

	return value
		.map((room) => ({
			name: normalizeString(room?.name),
			price: Math.max(0, normalizeNumber(room?.price)),
			description: normalizeString(room?.description),
			benefits: normalizeStringList(room?.benefits),
			images: normalizeImages(room?.images),
		}))
		.filter((room) => room.name || room.price || room.description || room.images.length)
}

const normalizeNearbyPoints = (value) => {
	if (!Array.isArray(value)) return []

	return value
		.map((item) => ({
			label: normalizeString(item?.label || item?.title),
			value: normalizeString(item?.value || item?.distance),
		}))
		.filter((item) => item.label || item.value)
}

const normalizeCoordinates = (value = {}) => ({
	x: value?.x === null || value?.x === undefined || value?.x === "" ? null : Number(value.x),
	y: value?.y === null || value?.y === undefined || value?.y === "" ? null : Number(value.y),
	address: normalizeString(value?.address) || null,
	label: normalizeString(value?.label) || null,
})

const normalizeContacts = (value = {}) => ({
	website: normalizeString(value?.website) || null,
	phone: normalizeString(value?.phone) || null,
	address: normalizeString(value?.address) || null,
	instagram: normalizeString(value?.instagram) || null,
})

const getMinHotelPrice = (hotel) => {
	const rooms = Array.isArray(hotel?.room_types) ? hotel.room_types : []
	const roomPrices = rooms
		.map((room) => Number(room?.price) || 0)
		.filter((price) => price > 0)

	if (roomPrices.length) return Math.min(...roomPrices)
	return Math.max(0, Number(hotel?.price) || 0)
}

const getEffectiveHotelPrice = (hotel) => {
	const price = getMinHotelPrice(hotel)
	const discount = Math.max(0, Math.min(100, Number(hotel?.discount) || 0))
	return Math.max(0, Math.round(price * (1 - discount / 100)))
}

const compareHotels = (left, right, sortBy) => {
	if (sortBy === "price_asc") {
		return getEffectiveHotelPrice(left) - getEffectiveHotelPrice(right)
	}

	if (sortBy === "price_desc") {
		return getEffectiveHotelPrice(right) - getEffectiveHotelPrice(left)
	}

	if (sortBy === "rating_desc" || sortBy === "popularity") {
		const diff = (Number(right?.rating) || 0) - (Number(left?.rating) || 0)
		if (diff !== 0) return diff
	}

	if (sortBy === "reviews_desc") {
		return (Number(right?.reviewsCount) || 0) - (Number(left?.reviewsCount) || 0)
	}

	return new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime()
}

const canManageHotel = (req, hotel) => {
	if (req.userRole === "admin") return true
	return req.partnerId && String(hotel.partner) === String(req.partnerId)
}

const buildHotelPayload = (body, partnerId, currentHotel = null) => {
	const currentData = currentHotel?.toObject ? currentHotel.toObject() : currentHotel || {}
	const has = (key) => Object.prototype.hasOwnProperty.call(body, key)
	const roomTypes = has("room_types")
		? normalizeRoomTypes(body.room_types)
		: normalizeRoomTypes(currentData.room_types)
	const fallbackPrice = roomTypes.length ? getMinHotelPrice({ room_types: roomTypes }) : 0

	return {
		name: has("name") ? normalizeString(body.name) : normalizeString(currentData.name),
		partner: partnerId,
		description: has("description")
			? normalizeString(body.description)
			: normalizeString(currentData.description),
		content: has("content") ? normalizeString(body.content) : normalizeString(currentData.content),
		rating: has("rating")
			? Math.max(0, Math.min(5, normalizeNumber(body.rating)))
			: Math.max(0, Math.min(5, normalizeNumber(currentData.rating))),
		reviewsCount: has("reviewsCount")
			? Math.max(0, normalizeNumber(body.reviewsCount))
			: Math.max(0, normalizeNumber(currentData.reviewsCount)),
		images: has("images") ? normalizeImages(body.images) : normalizeImages(currentData.images),
		location: has("location") ? normalizeString(body.location) : normalizeString(currentData.location),
		price: has("price")
			? Math.max(0, normalizeNumber(body.price))
			: Math.max(0, normalizeNumber(currentData.price || fallbackPrice)),
		discount: has("discount")
			? Math.max(0, Math.min(100, normalizeNumber(body.discount)))
			: Math.max(0, Math.min(100, normalizeNumber(currentData.discount))),
		is_hot: has("is_hot") ? Boolean(body.is_hot) : Boolean(currentData.is_hot),
		room_types: roomTypes,
		policy: has("policy") ? normalizeStringList(body.policy) : normalizeStringList(currentData.policy),
		meals: has("meals") ? normalizeStringList(body.meals) : normalizeStringList(currentData.meals),
		amenities: has("amenities") ? normalizeStringList(body.amenities) : normalizeStringList(currentData.amenities),
		paid_services: has("paid_services")
			? normalizeStringList(body.paid_services)
			: normalizeStringList(currentData.paid_services),
		family_features: has("family_features")
			? normalizeStringList(body.family_features)
			: normalizeStringList(currentData.family_features),
		accessibility: has("accessibility")
			? normalizeStringList(body.accessibility)
			: normalizeStringList(currentData.accessibility),
		entertainment: has("entertainment")
			? normalizeStringList(body.entertainment)
			: normalizeStringList(currentData.entertainment),
		nearby_points: has("nearby_points")
			? normalizeNearbyPoints(body.nearby_points)
			: normalizeNearbyPoints(currentData.nearby_points),
		coordinates: has("coordinates")
			? normalizeCoordinates(body.coordinates)
			: normalizeCoordinates(currentData.coordinates),
		contacts: has("contacts")
			? normalizeContacts(body.contacts)
			: normalizeContacts(currentData.contacts),
	}
}

export const getHotels = async (req, res) => {
	try {
		const search = normalizeString(req.query.search)
		const checkIn = normalizeQueryDate(req.query.checkIn)
		const checkOut = normalizeQueryDate(req.query.checkOut)
		const region = normalizeString(req.query.region || req.query.location)
		const priceFrom = req.query.priceFrom !== undefined ? Math.max(0, Number(req.query.priceFrom) || 0) : null
		const priceTo = req.query.priceTo !== undefined ? Math.max(0, Number(req.query.priceTo) || 0) : null
		const rating = req.query.rating !== undefined ? Math.max(0, Number(req.query.rating) || 0) : null
		const sortBy = normalizeString(req.query.sortBy)
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

		if (region) {
			query.location = new RegExp(escapeRegExp(region), "i")
		}

		const hotels = await HotelModel.find(query)
			.sort({ createdAt: -1 })
			.populate("partner")

		const filteredHotels = hotels
			.filter((hotel) => {
				const effectivePrice = getEffectiveHotelPrice(hotel)
				const hotelRating = Number(hotel?.rating) || 0

				if (priceFrom !== null && effectivePrice < priceFrom) return false
				if (priceTo !== null && effectivePrice > priceTo) return false
				if (rating !== null && hotelRating < rating) return false

				return true
			})
			.sort((left, right) => compareHotels(left, right, sortBy))

		res.json({
			data: filteredHotels,
			meta: {
				filters: {
					search,
					checkIn: checkIn || null,
					checkOut: checkOut || null,
					region: region || null,
					priceFrom,
					priceTo,
					rating,
					sortBy: sortBy || null,
				},
				total: filteredHotels.length,
			},
		})
	} catch (error) {
		console.error("❌ Ошибка получения отелей:", error)
		res.status(500).json({ message: "Ошибка при получении отелей" })
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
		res.status(500).json({ message: "Ошибка при получении отелей" })
	}
}

export const getOneHotel = async (req, res) => {
	try {
		const hotel = await HotelModel.findById(req.params.id).populate("partner")

		if (!hotel) {
			return res.status(404).json({ message: "Отель не найден" })
		}

		res.json({ data: hotel })
	} catch (error) {
		console.error("Ошибка при получении отеля:", error)
		res.status(500).json({ message: "Ошибка при получении отеля" })
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
		await PartnerModel.findByIdAndUpdate(partnerId, { $addToSet: { hotels: hotel._id } })
		const savedHotel = await HotelModel.findById(hotel._id).populate("partner")
		res.status(201).json({ data: savedHotel })
	} catch (error) {
		console.error("Ошибка при создании отеля:", error)
		res.status(500).json({ message: "Ошибка при создании отеля" })
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
			req.userRole === "partner" ? req.partnerId : normalizeString(req.body.partner) || currentPartnerId

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
			await PartnerModel.findByIdAndUpdate(currentPartnerId, { $pull: { hotels: hotel._id } })
		}

		await PartnerModel.findByIdAndUpdate(nextPartnerId, { $addToSet: { hotels: hotel._id } })

		const updatedHotel = await HotelModel.findById(hotel._id).populate("partner")
		return res.json({ message: "Отель обновлен", data: updatedHotel })
	} catch (error) {
		console.error("Ошибка при обновлении отеля:", error)
		return res.status(500).json({ message: "Ошибка при обновлении отеля" })
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
		await PartnerModel.findByIdAndUpdate(hotel.partner, { $pull: { hotels: hotel._id } })

		return res.json({ message: "Отель удален" })
	} catch (error) {
		console.error("Ошибка при удалении отеля:", error)
		return res.status(500).json({ message: "Ошибка при удалении отеля" })
	}
}
