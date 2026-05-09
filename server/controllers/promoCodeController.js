import HotelModel from "../models/Hotel.js"
import PartnerModel from "../models/Partner.js"
import PromoCodeModel from "../models/PromoCode.js"
import TourModel from "../models/Tour.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const normalizeDate = (value) => {
	const normalized = normalizeString(value)
	return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : ""
}

const normalizeCode = (value) => normalizeString(value).toUpperCase()

const normalizePromoPayload = (body = {}) => {
	const targetType = ["all", "tour", "hotel"].includes(normalizeString(body.targetType))
		? normalizeString(body.targetType)
		: "all"
	const discountType = ["percent", "fixed"].includes(normalizeString(body.discountType))
		? normalizeString(body.discountType)
		: "percent"

	return {
		title: normalizeString(body.title),
		code: normalizeCode(body.code),
		discountType,
		value: Math.max(0, Number(body.value) || 0),
		startsAt: normalizeDate(body.startsAt),
		endsAt: normalizeDate(body.endsAt),
		isActive: body.isActive !== false,
		targetType,
		tour: targetType === "tour" ? normalizeString(body.tour) || null : null,
		hotel: targetType === "hotel" ? normalizeString(body.hotel) || null : null,
	}
}

const isPromoActiveNow = (promo) => {
	if (!promo?.isActive) return false

	const today = new Date().toISOString().slice(0, 10)
	const startsAt = normalizeDate(promo?.startsAt)
	const endsAt = normalizeDate(promo?.endsAt)

	if (startsAt && today < startsAt) return false
	if (endsAt && today > endsAt) return false

	return true
}

const resolvePreviewRequestPayload = (body = {}) => ({
	code: normalizeCode(body.code || body.promoCode || body.promocode),
	subtotal: Math.max(
		0,
		Number(
			body.subtotal ??
				body.total ??
				body.amount ??
				body.price ??
				0
		) || 0
	),
	tourId: normalizeString(body.tourId || body.tour),
	hotelId: normalizeString(body.hotelId || body.hotel),
})

export const resolvePromoDiscount = async ({
	code,
	subtotal = 0,
	tourId = null,
	hotelId = null,
}) => {
	const normalizedCode = normalizeCode(code)

	if (!normalizedCode) {
		return { promo: null, discountAmount: 0, message: "Промокод не указан" }
	}

	const promo = await PromoCodeModel.findOne({ code: normalizedCode })

	if (!promo) {
		return { promo: null, discountAmount: 0, message: "Промокод не найден" }
	}

	if (!isPromoActiveNow(promo)) {
		return { promo, discountAmount: 0, message: "Промокод не активен" }
	}

	if (promo.targetType === "tour" && String(promo.tour) !== String(tourId || "")) {
		return {
			promo,
			discountAmount: 0,
			message: "Промокод не подходит для этого тура",
		}
	}

	if (promo.targetType === "hotel" && String(promo.hotel) !== String(hotelId || "")) {
		return {
			promo,
			discountAmount: 0,
			message: "Промокод не подходит для этого отеля",
		}
	}

	const total = Math.max(0, Number(subtotal) || 0)
	const discountAmount =
		promo.discountType === "percent"
			? Math.round((total * (Number(promo.value) || 0)) / 100)
			: Math.round(Number(promo.value) || 0)

	return {
		promo,
		discountAmount: Math.max(0, Math.min(total, discountAmount)),
		message: "",
	}
}

export const getPromoCodes = async (req, res) => {
	try {
		const filter = req.userRole === "partner" ? { partner: req.partnerId } : {}
		const promocodes = await PromoCodeModel.find(filter)
			.sort({ createdAt: -1 })
			.populate("tour hotel partner createdBy")

		return res.json({ data: promocodes })
	} catch (error) {
		console.error("Ошибка при получении промокодов:", error)
		return res.status(500).json({ message: "Ошибка при получении промокодов" })
	}
}

export const previewPromoCode = async (req, res) => {
	try {
		const payload = resolvePreviewRequestPayload(req.body)
		const result = await resolvePromoDiscount(payload)
		const responseData = {
			code: result?.promo?.code || payload.code,
			title: result?.promo?.title || "",
			discountType: result?.promo?.discountType || "percent",
			value: Number(result?.promo?.value) || 0,
			discountAmount: Number(result?.discountAmount) || 0,
			message: result?.message || "",
			isValid: Boolean(result?.promo) && Number(result?.discountAmount) > 0,
		}

		if (!responseData.isValid) {
			return res.status(200).json({
				message: responseData.message || "Промокод не применен",
				data: responseData,
				...responseData,
			})
		}

		return res.json({
			data: responseData,
			...responseData,
		})
	} catch (error) {
		console.error("Ошибка при проверке промокода:", error)
		return res.status(500).json({ message: "Ошибка при проверке промокода" })
	}
}

export const createPromoCode = async (req, res) => {
	try {
		const payload = normalizePromoPayload(req.body)

		if (!payload.code) {
			return res.status(400).json({ message: "Код промокода обязателен" })
		}

		if (!payload.value) {
			return res.status(400).json({ message: "Значение промокода обязательно" })
		}

		if (payload.startsAt && payload.endsAt && payload.startsAt > payload.endsAt) {
			return res.status(400).json({
				message: "Дата окончания не может быть раньше даты начала",
			})
		}

		let partnerId = null
		if (req.userRole === "partner") {
			partnerId = req.partnerId
		} else if (normalizeString(req.body.partner)) {
			partnerId = normalizeString(req.body.partner)
		}

		if (partnerId) {
			const partner = await PartnerModel.findById(partnerId)
			if (!partner) {
				return res.status(404).json({ message: "Партнер не найден" })
			}
		}

		if (payload.targetType === "tour") {
			const tour = await TourModel.findById(payload.tour)
			if (!tour) {
				return res.status(404).json({ message: "Тур не найден" })
			}

			if (req.userRole === "partner" && String(tour.partner) !== String(req.partnerId)) {
				return res.status(403).json({ message: "Нет доступа к этому туру" })
			}
		}

		if (payload.targetType === "hotel") {
			const hotel = await HotelModel.findById(payload.hotel)
			if (!hotel) {
				return res.status(404).json({ message: "Отель не найден" })
			}

			if (req.userRole === "partner" && String(hotel.partner) !== String(req.partnerId)) {
				return res.status(403).json({ message: "Нет доступа к этому отелю" })
			}
		}

		const promocode = await PromoCodeModel.create({
			...payload,
			partner: partnerId,
			createdBy: req.userId,
		})

		const saved = await PromoCodeModel.findById(promocode._id).populate(
			"tour hotel partner createdBy"
		)

		return res.status(201).json({ data: saved })
	} catch (error) {
		console.error("Ошибка при создании промокода:", error)
		if (error?.code === 11000) {
			return res.status(409).json({ message: "Такой промокод уже существует" })
		}

		return res.status(500).json({ message: "Ошибка при создании промокода" })
	}
}
