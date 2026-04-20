import PartnerModel from "../models/Partner.js"
import UserModel from "../models/User.js"
import TourModel from "../models/Tour.js"
import { resolvePromoDiscount } from "./promoCodeController.js"

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

const normalizePositiveNumber = (value) => {
	const normalized = normalizeString(value)

	if (!normalized) {
		return null
	}

	const parsed = Number(normalized)
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

const normalizeSortBy = (value) => {
	const normalized = normalizeString(value)
	const allowedValues = new Set([
		"newest",
		"price_asc",
		"price_desc",
		"rating_desc",
		"popularity",
	])

	return allowedValues.has(normalized) ? normalized : "newest"
}

const parseComparableDate = (value) => {
	const normalized = normalizeString(value)

	if (!normalized) {
		return null
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
		return normalized
	}

	if (/^\d{2}\.\d{2}\.\d{4}$/.test(normalized)) {
		const [day, month, year] = normalized.split(".")
		return `${year}-${month}-${day}`
	}

	return null
}

const extractComparableDates = (tour) => {
	const values = [
		...(Array.isArray(tour?.availabilityDates)
			? tour.availabilityDates.map((item) => item?.date)
			: []),
		...(Array.isArray(tour?.dateDetails)
			? tour.dateDetails.map((item) => item?.date)
			: []),
		...(Array.isArray(tour?.dates) ? tour.dates : []),
	]

	return [...new Set(values.map(parseComparableDate).filter(Boolean))]
}

const buildSearchHaystack = (tour) => {
	return [
		tour?.title,
		tour?.description,
		tour?.duration,
		tour?.departureCity,
		tour?.departurePoint,
		...(Array.isArray(tour?.highlights) ? tour.highlights : []),
	]
		.map((item) => normalizeString(item).toLowerCase())
		.filter(Boolean)
		.join(" ")
}

const compareTours = (left, right, sortBy) => {
	if (sortBy === "price_asc") {
		return (Number(left?.price) || 0) - (Number(right?.price) || 0)
	}

	if (sortBy === "price_desc") {
		return (Number(right?.price) || 0) - (Number(left?.price) || 0)
	}

	if (sortBy === "rating_desc" || sortBy === "popularity") {
		const ratingDiff = (Number(right?.rating) || 0) - (Number(left?.rating) || 0)
		if (ratingDiff !== 0) return ratingDiff
	}

	return new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime()
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

const hasOwn = (value, key) =>
	Object.prototype.hasOwnProperty.call(value || {}, key)

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

const normalizeAvailabilityDates = (
	value,
	legacyDates = [],
	currentAvailabilityDates = []
) => {
	const currentByDate = new Map(
		(currentAvailabilityDates || [])
			.map((item) => [normalizeString(item?.date), item])
			.filter(([date]) => date)
	)
	const source = Array.isArray(value) && value.length
		? value
		: normalizeStringArray(legacyDates).map((date) => ({ date }))

	return normalizeObjectArray(source, (item) => {
		const date = normalizeString(item?.date)
		const currentSlot = currentByDate.get(date)
		const timeFrom = normalizeString(item?.timeFrom)
		const timeTo = normalizeString(item?.timeTo)
		const hasSeats = item?.seats !== undefined && item?.seats !== null && item?.seats !== ""
		const hasBookedSeats =
			item?.bookedSeats !== undefined &&
			item?.bookedSeats !== null &&
			item?.bookedSeats !== ""
		const seats = Math.max(
			0,
			hasSeats ? Number(item?.seats) || 0 : Number(currentSlot?.seats) || 0
		)
		const bookedSeats = Math.max(
			0,
			hasBookedSeats
				? Number(item?.bookedSeats) || 0
				: Number(currentSlot?.bookedSeats) || 0
		)

		if (!date && !timeFrom && !timeTo && !seats && !bookedSeats) return null

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

const buildTourPayload = (body, partnerId, currentTour = null) => {
	const currentData = currentTour?.toObject ? currentTour.toObject() : currentTour || {}
	const images = hasOwn(body, "images")
		? normalizeStringArray(body.images)
		: normalizeStringArray(currentData.images)
	const avatar = hasOwn(body, "avatar")
		? normalizeString(body.avatar) || images[0] || null
		: normalizeString(currentData.avatar) || images[0] || null
	const rawDates = hasOwn(body, "dates")
		? normalizeStringArray(body.dates)
		: normalizeStringArray(currentData.dates)
	const dateDetailsSource = hasOwn(body, "dateDetails")
		? body.dateDetails
		: currentData.dateDetails
	const availabilitySource = hasOwn(body, "availabilityDates")
		? body.availabilityDates
		: currentData.availabilityDates
	const dateDetails = normalizeDateDetails(dateDetailsSource, rawDates)
	const availabilityDates = normalizeAvailabilityDates(
		availabilitySource,
		dateDetails.map((item) => item.date).filter(Boolean)
			.length
			? dateDetails.map((item) => item.date).filter(Boolean)
			: rawDates,
		currentData.availabilityDates
	)
	const derivedDates = rawDates.length
		? rawDates
		: dateDetails.length
			? dateDetails.map((item) => item.date).filter(Boolean)
			: availabilityDates.map((item) => item.date).filter(Boolean)

	return {
		title: hasOwn(body, "title")
			? normalizeString(body.title)
			: normalizeString(currentData.title),
		description: hasOwn(body, "description")
			? normalizeString(body.description)
			: normalizeString(currentData.description),
		avatar,
		images,
		price: hasOwn(body, "price") ? Number(body.price) || 0 : Number(currentData.price) || 0,
		discount: hasOwn(body, "discount")
			? Number(body.discount) || 0
			: Number(currentData.discount) || 0,
		is_hot: hasOwn(body, "is_hot") ? Boolean(body.is_hot) : Boolean(currentData.is_hot),
		rating: hasOwn(body, "rating")
			? Number(body.rating) || 0
			: Number(currentData.rating) || 0,
		duration: hasOwn(body, "duration")
			? normalizeString(body.duration)
			: normalizeString(currentData.duration),
		highlights: hasOwn(body, "highlights")
			? normalizeStringArray(body.highlights)
			: normalizeStringArray(currentData.highlights),
		dates: derivedDates,
		dateDetails,
		availabilityDates,
		departureCity: hasOwn(body, "departureCity")
			? normalizeString(body.departureCity)
			: normalizeString(currentData.departureCity),
		departurePoint: hasOwn(body, "departurePoint")
			? normalizeString(body.departurePoint)
			: normalizeString(currentData.departurePoint),
		departureLocation: hasOwn(body, "departureLocation")
			? normalizeLocation(body.departureLocation)
			: normalizeLocation(currentData.departureLocation),
		departureMapImage: hasOwn(body, "departureMapImage")
			? normalizeString(body.departureMapImage) || null
			: normalizeString(currentData.departureMapImage) || null,
		routeMapImage: hasOwn(body, "routeMapImage")
			? normalizeString(body.routeMapImage) || null
			: normalizeString(currentData.routeMapImage) || null,
		program: hasOwn(body, "program")
			? normalizeProgram(body.program)
			: normalizeProgram(currentData.program),
		routePlaces: hasOwn(body, "routePlaces")
			? normalizeRoutePlaces(body.routePlaces)
			: normalizeRoutePlaces(currentData.routePlaces),
		packingList: hasOwn(body, "packingList")
			? normalizeStringArray(body.packingList)
			: normalizeStringArray(currentData.packingList),
		recommendations: hasOwn(body, "recommendations")
			? normalizeStringArray(body.recommendations)
			: normalizeStringArray(currentData.recommendations),
		includes: hasOwn(body, "includes")
			? normalizeStringArray(body.includes)
			: normalizeStringArray(currentData.includes),
		excludes: hasOwn(body, "excludes")
			? normalizeStringArray(body.excludes)
			: normalizeStringArray(currentData.excludes),
		ticketTypes: hasOwn(body, "ticketTypes")
			? normalizeTicketTypes(body.ticketTypes)
			: normalizeTicketTypes(currentData.ticketTypes),
		contacts: hasOwn(body, "contacts")
			? normalizeContacts(body.contacts)
			: normalizeContacts(currentData.contacts),
		partner: partnerId,
		hotels: Array.isArray(body.hotels)
			? body.hotels
			: Array.isArray(currentData.hotels)
				? currentData.hotels
				: [],
	}
}

const canManageTour = (req, tour) => {
	if (req.userRole === "admin") return true
	return req.partnerId && String(tour.partner) === String(req.partnerId)
}

export const getTours = async (req, res) => {
	try {
		const search = normalizeString(req.query.search)
		const dateFrom = normalizeQueryDate(req.query.dateFrom)
		const dateTo = normalizeQueryDate(req.query.dateTo)
		const priceFrom = normalizePositiveNumber(req.query.priceFrom)
		const priceTo = normalizePositiveNumber(req.query.priceTo)
		const duration = normalizeString(req.query.duration)
		const location = normalizeString(req.query.location)
		const sortBy = normalizeSortBy(req.query.sortBy)
		const normalizedSearch = search.toLowerCase()
		const normalizedDuration = duration.toLowerCase()
		const normalizedLocation = location.toLowerCase()
		const tours = await TourModel.find()
			.populate("partner")
		const filteredTours = tours
			.filter((tour) => {
				if (normalizedSearch) {
					const haystack = buildSearchHaystack(tour)
					if (!haystack.includes(normalizedSearch)) {
						return false
					}
				}

				if (normalizedDuration) {
					const value = normalizeString(tour?.duration).toLowerCase()
					if (!value.includes(normalizedDuration)) {
						return false
					}
				}

				if (normalizedLocation) {
					const locationHaystack = [
						normalizeString(tour?.departureCity),
						normalizeString(tour?.departurePoint),
					]
						.join(" ")
						.toLowerCase()

					if (!locationHaystack.includes(normalizedLocation)) {
						return false
					}
				}

				if (priceFrom !== null && (Number(tour?.price) || 0) < priceFrom) {
					return false
				}

				if (priceTo !== null && (Number(tour?.price) || 0) > priceTo) {
					return false
				}

				if (dateFrom || dateTo) {
					const comparableDates = extractComparableDates(tour)

					if (!comparableDates.length) {
						return false
					}

					const hasMatch = comparableDates.some((date) => {
						if (dateFrom && date < dateFrom) return false
						if (dateTo && date > dateTo) return false
						return true
					})

					if (!hasMatch) {
						return false
					}
				}

				return true
			})
			.sort((left, right) => compareTours(left, right, sortBy))

		res.json({
			data: filteredTours,
			meta: {
				total: filteredTours.length,
				filters: {
					search,
					dateFrom: dateFrom || null,
					dateTo: dateTo || null,
					priceFrom,
					priceTo,
					duration: duration || null,
					location: location || null,
					sortBy,
				},
			},
		})
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

		const payload = buildTourPayload(req.body, nextPartnerId, tour)

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
		const tour = await TourModel.findById(req.params.id)

		if (!tour) {
			return res.status(404).json({ message: "Тур не найден" })
		}

		const availabilityDateId = normalizeString(req.body.availabilityDateId)
		const slot = tour.availabilityDates.id(availabilityDateId)

		if (!slot) {
			return res.status(404).json({ message: "Дата тура не найдена" })
		}

		const requestedTickets = Array.isArray(req.body.ticketSelections)
			? req.body.ticketSelections
			: []
		const normalizedTicketSelections = requestedTickets
			.map((item, index) => {
				const quantity = Math.max(0, Number(item?.quantity) || 0)
				const sourceTicket = tour.ticketTypes[index] || {}
				const price = Math.max(0, Number(sourceTicket?.price ?? item?.price) || 0)
				const title = normalizeString(sourceTicket?.title || item?.title)

				if (!quantity) {
					return null
				}

				return {
					title,
					quantity,
					price,
					subtotal: quantity * price,
				}
			})
			.filter(Boolean)
		const guests = normalizedTicketSelections.reduce(
			(total, item) => total + (Number(item.quantity) || 0),
			0
		)

		if (!guests) {
			return res.status(400).json({ message: "Выберите хотя бы один билет" })
		}

		const seats = Number(slot.seats) || 0
		const bookedSeats = Number(slot.bookedSeats) || 0
		const availableSeats = Math.max(0, seats - bookedSeats)

		if (availableSeats < guests) {
			return res.status(409).json({ message: "На эту дату нет мест" })
		}

		const subtotal = normalizedTicketSelections.reduce(
			(total, item) => total + (Number(item.subtotal) || 0),
			0
		)
		const tourDiscountPercent = Math.max(0, Number(tour.discount) || 0)
		const tourDiscountAmount = Math.round((subtotal * tourDiscountPercent) / 100)
		const afterTourDiscount = Math.max(0, subtotal - tourDiscountAmount)
		const promoResult = normalizeString(req.body.promoCode)
			? await resolvePromoDiscount({
					code: req.body.promoCode,
					subtotal: afterTourDiscount,
					tourId: tour._id,
			  })
			: { promo: null, discountAmount: 0 }
		const promoDiscountAmount = Number(promoResult.discountAmount) || 0
		const afterPromoDiscount = Math.max(0, afterTourDiscount - promoDiscountAmount)
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" })
		}

		const paymentMethod = normalizeString(req.body.paymentMethod) || "card"
		const requestedBonusAmount = Math.max(0, Number(req.body.bonusAmount) || 0)
		const useBonusBalance =
			paymentMethod === "bonus" || Boolean(req.body.useBonusBalance)
		const availableBonusBalance = Math.max(0, Number(user.bonusBalance) || 0)
		const bonusAmount = useBonusBalance
			? paymentMethod === "bonus"
				? Math.min(availableBonusBalance, afterPromoDiscount)
				: Math.min(availableBonusBalance, requestedBonusAmount, afterPromoDiscount)
			: 0
		const total = Math.max(0, afterPromoDiscount - bonusAmount)

		if (paymentMethod === "bonus" && bonusAmount < afterPromoDiscount) {
			return res.status(409).json({
				message: "Недостаточно бонусов для полной оплаты",
			})
		}

		slot.bookedSeats = bookedSeats + guests
		user.bonusBalance = Math.max(0, availableBonusBalance - bonusAmount)
		user.tourBookings.unshift({
			tour: tour._id,
			availabilityDateId,
			date: normalizeString(slot.date),
			timeFrom: normalizeString(slot.timeFrom),
			timeTo: normalizeString(slot.timeTo),
			guests,
			ticketSelections: normalizedTicketSelections,
			promoCode: promoResult?.promo?.code || null,
			promoDiscountAmount,
			tourDiscountPercent,
			paidWithBonuses: bonusAmount,
			paymentMethod,
			total,
			status: "active",
		})
		user.walletTransactions.unshift({
			name: normalizeString(tour.title) || "Бронирование тура",
			type: "Тур",
			amount: -total,
			currency: "KZT",
			note: `Оплата тура (${normalizeString(slot.date) || "без даты"})`,
		})

		if (bonusAmount > 0) {
			user.walletTransactions.unshift({
				name: normalizeString(tour.title) || "Списание бонусов",
				type: "Бонусы",
				amount: -bonusAmount,
				currency: "BONUS",
				note: "Оплата бонусами",
			})
		}

		const bonusAccrual = paymentMethod === "bonus" ? 0 : Math.floor(total * 0.05)

		if (bonusAccrual > 0) {
			user.bonusBalance += bonusAccrual
			user.walletTransactions.unshift({
				name: normalizeString(tour.title) || "Начисление бонусов",
				type: "Бонусы",
				amount: bonusAccrual,
				currency: "BONUS",
				note: "Начисление за покупку тура",
			})
		}

		await tour.save()
		await user.save()

		const updatedTour = await TourModel.findById(tour._id).populate("partner")
		const latestUser = await UserModel.findById(req.userId).populate({
			path: "tourBookings.tour",
			populate: { path: "partner" },
		})
		const booking = latestUser?.tourBookings?.[0] || null

		return res.json({
			message: "Место забронировано",
			data: {
				tour: updatedTour,
				booking,
				wallet: {
					bonusBalance: Math.max(0, Number(latestUser?.bonusBalance) || 0),
				},
				pricing: {
					subtotal,
					tourDiscountPercent,
					tourDiscountAmount,
					promoDiscountAmount,
					bonusAmount,
					total,
				},
			},
		})
	} catch (error) {
		console.error("Ошибка при бронировании даты тура:", error)
		return res.status(500).json({ message: "Ошибка при бронировании тура" })
	}
}
