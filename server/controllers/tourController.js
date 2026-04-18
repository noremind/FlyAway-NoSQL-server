import PartnerModel from "../models/Partner.js"
import TourModel from "../models/Tour.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const normalizeStringArray = (value) => {
	if (!Array.isArray(value)) return []
	return value
		.map((item) => normalizeString(item))
		.filter(Boolean)
}

const normalizeObjectArray = (value, mapper) => {
	if (!Array.isArray(value)) return []
	return value.map(mapper).filter(Boolean)
}

const normalizeTicketTypes = (value) => {
	return normalizeObjectArray(value, (item) => {
		const title = normalizeString(item?.title)
		const subtitle = normalizeString(item?.subtitle)
		const price = Number(item?.price) || 0

		if (!title && !subtitle && !price) return null

		return {
			title,
			subtitle,
			price,
		}
	})
}

const normalizeProgram = (value) => {
	return normalizeObjectArray(value, (item) => {
		const time = normalizeString(item?.time)
		const text = normalizeString(item?.text)

		if (!time && !text) return null

		return {
			time,
			text,
		}
	})
}

const normalizeDateDetails = (value, legacyDates = []) => {
	const source = Array.isArray(value) && value.length
		? value
		: normalizeStringArray(legacyDates).map((date) => ({ date, text: "" }))

	return normalizeObjectArray(source, (item) => {
		const date = normalizeString(item?.date ?? item)
		const text = normalizeString(item?.text)

		if (!date && !text) return null

		return {
			date,
			text,
		}
	})
}

const normalizeAvailabilityDates = (value, legacyDates = []) => {
	const source = Array.isArray(value) && value.length
		? value
		: normalizeStringArray(legacyDates).map((date) => ({ date }))

	return normalizeObjectArray(source, (item) => {
		const date = normalizeString(item?.date)
		const timeFrom = normalizeString(item?.timeFrom)
		const timeTo = normalizeString(item?.timeTo)
		const seats = Math.max(0, Number(item?.seats) || 0)
		const bookedSeats = Math.max(0, Number(item?.bookedSeats) || 0)

		if (!date && !timeFrom && !timeTo && !seats) return null

		return {
			date,
			timeFrom,
			timeTo,
			seats,
			bookedSeats: Math.min(bookedSeats, seats || bookedSeats),
		}
	})
}

const normalizeRoutePlaces = (value) => {
	return normalizeObjectArray(value, (item) => {
		const title = normalizeString(item?.title)
		const image = normalizeString(item?.image)

		if (!title && !image) return null

		return {
			title,
			image: image || null,
		}
	})
}

const normalizeContacts = (value = {}) => ({
	website: normalizeString(value.website) || null,
	phone: normalizeString(value.phone) || null,
	address: normalizeString(value.address) || null,
	instagram: normalizeString(value.instagram) || null,
})

const normalizeLocation = (value) => {
	if (!value || typeof value !== "object") return null

	const x = Number(value.x ?? value.lat ?? value.latitude)
	const y = Number(value.y ?? value.lng ?? value.lon ?? value.longitude)
	const address = normalizeString(value.address)
	const label = normalizeString(value.label)

	if (!Number.isFinite(x) || !Number.isFinite(y)) return null

	return {
		x,
		y,
		address: address || null,
		label: label || address || null,
	}
}

const buildTourPayload = (body, partnerId) => {
	const images = normalizeStringArray(body.images)
	const avatar = normalizeString(body.avatar) || images[0] || null
	const dateDetails = normalizeDateDetails(body.dateDetails, body.dates)
	const availabilityDates = normalizeAvailabilityDates(
		body.availabilityDates,
		dateDetails.map((item) => item.date).filter(Boolean)
	)

	return {
		title: normalizeString(body.title),
		description: normalizeString(body.description),
		avatar,
		images,
		price: Number(body.price) || 0,
		discount: Number(body.discount) || 0,
		is_hot: Boolean(body.is_hot),
		rating: Number(body.rating) || 0,
		duration: normalizeString(body.duration),
		highlights: normalizeStringArray(body.highlights),
		dates: dateDetails.length
			? dateDetails.map((item) => item.date).filter(Boolean)
			: availabilityDates.length
				? availabilityDates.map((item) => item.date).filter(Boolean)
				: normalizeStringArray(body.dates),
		dateDetails,
		availabilityDates,
		departureCity: normalizeString(body.departureCity),
		departurePoint: normalizeString(body.departurePoint),
		departureLocation: normalizeLocation(body.departureLocation),
		departureMapImage: normalizeString(body.departureMapImage) || null,
		routeMapImage: normalizeString(body.routeMapImage) || null,
		program: normalizeProgram(body.program),
		routePlaces: normalizeRoutePlaces(body.routePlaces),
		packingList: normalizeStringArray(body.packingList),
		recommendations: normalizeStringArray(body.recommendations),
		includes: normalizeStringArray(body.includes),
		excludes: normalizeStringArray(body.excludes),
		ticketTypes: normalizeTicketTypes(body.ticketTypes),
		contacts: normalizeContacts(body.contacts),
		partner: partnerId,
		hotels: Array.isArray(body.hotels) ? body.hotels : [],
	}
}

const canManageTour = (req, tour) => {
	if (req.userRole === "admin") return true
	return req.partnerId && String(tour.partner) === String(req.partnerId)
}

export const getTours = async (req, res) => {
	try {
		const tours = await TourModel.find().sort({ createdAt: -1 }).populate("partner")
		res.json({ data: tours })
	} catch (error) {
		res.status(500).json({
			message: "Ошибка при получении туров",
		})
	}
}

export const getManagedTours = async (req, res) => {
	try {
		const filter = req.userRole === "partner" ? { partner: req.partnerId } : {}
		const tours = await TourModel.find(filter)
			.sort({ updatedAt: -1 })
			.populate("partner")

		return res.json({ data: tours })
	} catch (error) {
		console.error("Ошибка при получении управляемых туров:", error)
		return res.status(500).json({
			message: "Ошибка при получении туров",
		})
	}
}

export const getOneTour = async (req, res) => {
	try {
		const tour = await TourModel.findById(req.params.id).populate("partner")

		if (!tour) {
			return res.status(404).json({
				message: "Тур не найден",
			})
		}

		const { createdAt, updatedAt, __v, ...tourData } = tour._doc

		res.json({
			data: { ...tourData },
		})
	} catch (error) {
		console.error("Ошибка при получении тура:", error)
		res.status(500).json({
			message: "Ошибка при получении тура",
		})
	}
}

export const createTour = async (req, res) => {
	try {
		const partnerId = req.userRole === "partner" ? req.partnerId : req.body.partner

		if (!normalizeString(req.body.title)) {
			return res.status(400).json({ message: "Название тура обязательно" })
		}

		if (!partnerId) {
			return res.status(400).json({ message: "Партнер для тура обязателен" })
		}

		const partner = await PartnerModel.findById(partnerId)

		if (!partner) {
			return res.status(404).json({ message: "Партнер не найден" })
		}

		const doc = new TourModel(buildTourPayload(req.body, partnerId))
		const tour = await doc.save()

		await PartnerModel.findByIdAndUpdate(partnerId, {
			$addToSet: { tours: tour._id },
		})

		const savedTour = await TourModel.findById(tour._id).populate("partner")
		return res.status(201).json({ data: savedTour })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Ошибка при создании тура",
		})
	}
}

export const updateTour = async (req, res) => {
	try {
		const tour = await TourModel.findById(req.params.id)

		if (!tour) {
			return res.status(404).json({ message: "Тур не найден" })
		}

		if (!canManageTour(req, tour)) {
			return res.status(403).json({ message: "Нет доступа к редактированию тура" })
		}

		const currentPartnerId = String(tour.partner)
		const nextPartnerId =
			req.userRole === "partner"
				? req.partnerId
				: normalizeString(req.body.partner) || currentPartnerId

		const partner = await PartnerModel.findById(nextPartnerId)

		if (!partner) {
			return res.status(404).json({ message: "Партнер не найден" })
		}

		const payload = buildTourPayload(req.body, nextPartnerId)

		if (!payload.title) {
			return res.status(400).json({ message: "Название тура обязательно" })
		}

		Object.assign(tour, payload)
		await tour.save()

		if (currentPartnerId !== String(nextPartnerId)) {
			await PartnerModel.findByIdAndUpdate(currentPartnerId, {
				$pull: { tours: tour._id },
			})
		}

		await PartnerModel.findByIdAndUpdate(nextPartnerId, {
			$addToSet: { tours: tour._id },
		})

		const updatedTour = await TourModel.findById(tour._id).populate("partner")
		return res.json({
			message: "Тур обновлен",
			data: updatedTour,
		})
	} catch (error) {
		console.error("Ошибка при обновлении тура:", error)
		return res.status(500).json({
			message: "Ошибка при обновлении тура",
		})
	}
}

export const bookTourDate = async (req, res) => {
	try {
		const guests = Math.max(1, Number(req.body.guests) || 1)
		const tour = await TourModel.findById(req.params.id)

		if (!tour) {
			return res.status(404).json({ message: "Тур не найден" })
		}

		const slot = tour.availabilityDates.id(req.body.availabilityDateId)

		if (!slot) {
			return res.status(404).json({ message: "Дата тура не найдена" })
		}

		const seats = Number(slot.seats) || 0
		const bookedSeats = Number(slot.bookedSeats) || 0
		const availableSeats = Math.max(0, seats - bookedSeats)

		if (availableSeats < guests) {
			return res.status(409).json({ message: "На эту дату нет мест" })
		}

		slot.bookedSeats = bookedSeats + guests
		await tour.save()

		const updatedTour = await TourModel.findById(tour._id).populate("partner")

		return res.json({
			message: "Место забронировано",
			data: updatedTour,
		})
	} catch (error) {
		console.error("Ошибка при бронировании даты тура:", error)
		return res.status(500).json({ message: "Ошибка при бронировании тура" })
	}
}
