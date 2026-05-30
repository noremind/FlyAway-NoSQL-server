import mongoose from "mongoose"
import TourModel from "../models/Tour.js"
import UserModel from "../models/User.js"
import { resolvePromoDiscount } from "./promoCodeController.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const onlyDigits = (value) => normalizeString(value).replace(/\D/g, "")

const normalizeCard = (card = {}) => {
	const digits = onlyDigits(card.number || card.cardNumber)
	const holder = normalizeString(card.holder || card.cardHolder).toUpperCase().replace(/\s+/g, " ")
	const expiry = onlyDigits(card.expiry || card.expiryDate)
	const code = onlyDigits(card.code || card.cvv || card.cvc)
	const month = Number(expiry.slice(0, 2))

	if (digits.length !== 12) {
		throw Object.assign(new Error("Номер карты должен содержать ровно 12 цифр"), { statusCode: 400 })
	}

	if (!/^[A-Z]+(?: [A-Z]+)*$/.test(holder)) {
		throw Object.assign(new Error("Имя держателя карты должно быть на английском и заглавными буквами"), { statusCode: 400 })
	}

	if (expiry.length !== 4 || month < 1 || month > 12) {
		throw Object.assign(new Error("Срок действия карты должен быть в формате MMYY"), { statusCode: 400 })
	}

	if (code.length !== 3) {
		throw Object.assign(new Error("Код карты должен содержать ровно 3 цифры"), { statusCode: 400 })
	}

	return {
		mask: `${digits.slice(0, 4)} **** ${digits.slice(-4)}`,
		holder,
	}
}

const hasCardPayload = (value) => {
	if (!value || typeof value !== "object") return false
	return Boolean(value.number || value.cardNumber || value.holder || value.cardHolder || value.expiry || value.expiryDate || value.cvv || value.cvc || value.code)
}

const getSlot = (tour, body) => {
	const availabilityDateId = normalizeString(body.availabilityDateId)
	const requestedDate = normalizeString(body.date)
	const requestedFrom = normalizeString(body.timeFrom)
	const requestedTo = normalizeString(body.timeTo)
	let slot = availabilityDateId ? tour.availabilityDates.id(availabilityDateId) : null

	if (!slot && requestedDate) {
		slot = tour.availabilityDates.find((item) => {
			if (normalizeString(item?.date) !== requestedDate) return false
			if (requestedFrom && normalizeString(item?.timeFrom) !== requestedFrom) return false
			if (requestedTo && normalizeString(item?.timeTo) !== requestedTo) return false
			return true
		}) || null
	}

	if (!slot && requestedDate) {
		const sameDateSlots = tour.availabilityDates.filter((item) => normalizeString(item?.date) === requestedDate)
		if (sameDateSlots.length === 1) slot = sameDateSlots[0]
	}

	return slot
}

const buildTicketSelections = (tour, items = []) => {
	return (Array.isArray(items) ? items : [])
		.map((item, index) => {
			const quantity = Math.max(0, Number(item?.quantity) || 0)
			const sourceTicket = tour.ticketTypes[index] || {}
			const price = Math.max(0, Number(sourceTicket?.price ?? item?.price) || 0)
			const title = normalizeString(sourceTicket?.title || item?.title)
			if (!quantity) return null
			return { title, quantity, price, subtotal: quantity * price }
		})
		.filter(Boolean)
}

export const bookTourDate = async (req, res) => {
	const session = await mongoose.startSession()

	try {
		let responseData = null

		await session.withTransaction(async () => {
			const tour = await TourModel.findById(req.params.id).session(session)
			if (!tour) throw Object.assign(new Error("Тур не найден"), { statusCode: 404 })

			const slot = getSlot(tour, req.body)
			if (!slot) throw Object.assign(new Error("Дата тура не найдена"), { statusCode: 404 })

			const ticketSelections = buildTicketSelections(tour, req.body.ticketSelections)
			const guests = ticketSelections.reduce((total, item) => total + (Number(item.quantity) || 0), 0)
			if (!guests) throw Object.assign(new Error("Выберите хотя бы один билет"), { statusCode: 400 })

			const seats = Number(slot.seats) || 0
			const bookedSeats = Number(slot.bookedSeats) || 0
			const availableSeats = Math.max(0, seats - bookedSeats)
			if (availableSeats < guests) throw Object.assign(new Error("На эту дату нет мест"), { statusCode: 409 })

			const subtotal = ticketSelections.reduce((total, item) => total + (Number(item.subtotal) || 0), 0)
			const tourDiscountPercent = Math.max(0, Number(tour.discount) || 0)
			const tourDiscountAmount = Math.round((subtotal * tourDiscountPercent) / 100)
			const afterTourDiscount = Math.max(0, subtotal - tourDiscountAmount)
			const promoResolution = await resolvePromoDiscount({
				code: req.body.promoCode,
				scope: "tour",
				partnerId: tour.partner,
				subtotal: afterTourDiscount,
				session,
			})
			const promoDiscountAmount = Number(promoResolution.discountAmount) || 0
			const totalAfterDiscounts = Math.max(0, afterTourDiscount - promoDiscountAmount)
			const paymentMethod = normalizeString(req.body.paymentMethod) === "bonus" ? "bonus" : "card"
			const user = await UserModel.findById(req.userId).session(session)
			if (!user) throw Object.assign(new Error("Пользователь не найден"), { statusCode: 404 })

			let paidWithBonuses = 0
			let cardSnapshot = { mask: "", holder: "" }

			if (paymentMethod === "bonus") {
				const availableBonus = Math.max(0, Number(user.bonusBalance) || 0)
				paidWithBonuses = Math.min(availableBonus, totalAfterDiscounts)
				if (paidWithBonuses < totalAfterDiscounts) {
					throw Object.assign(new Error("Недостаточно бонусов для оплаты"), { statusCode: 400 })
				}
				user.bonusBalance = Math.max(0, availableBonus - paidWithBonuses)
				user.walletTransactions.unshift({
					name: tour.title,
					type: "Оплата",
					amount: -paidWithBonuses,
					currency: "BONUS",
					note: `Оплата тура: ${tour.title}`,
				})
			} else if (hasCardPayload(req.body.paymentCard)) {
				cardSnapshot = normalizeCard(req.body.paymentCard)
			}

			slot.bookedSeats = Math.min(seats, bookedSeats + guests)
			await tour.save({ session })

			const paidWithMoney = Math.max(0, totalAfterDiscounts - paidWithBonuses)
			const booking = {
				tour: tour._id,
				availabilityDateId: normalizeString(slot._id),
				date: slot.date,
				timeFrom: slot.timeFrom,
				timeTo: slot.timeTo,
				guests,
				ticketSelections,
				promoCode: promoResolution.promoCode || null,
				promoDiscountAmount,
				tourDiscountPercent,
				paidWithBonuses,
				paidWithMoney,
				paymentMethod,
				paymentCardMask: cardSnapshot.mask,
				paymentCardHolder: cardSnapshot.holder,
				total: paidWithMoney,
				status: "active",
			}

			user.tourBookings.push(booking)

			if (paymentMethod === "card" && paidWithMoney > 0) {
				user.walletTransactions.unshift({
					name: tour.title,
					type: "Покупка",
					amount: paidWithMoney,
					currency: "KZT",
					note: cardSnapshot.mask ? `Оплата банковской картой ${cardSnapshot.mask}` : "Оплата банковской картой",
				})

				const bonusAccrual = Math.floor(paidWithMoney * 0.05)
				if (bonusAccrual > 0) {
					user.bonusBalance = Math.max(0, Number(user.bonusBalance) || 0) + bonusAccrual
					user.walletTransactions.unshift({
						name: tour.title,
						type: "Бонусы",
						amount: bonusAccrual,
						currency: "BONUS",
						note: "Начисление бонусов за бронирование",
					})
				}
			}

			await user.save({ session })
			const updatedTour = await TourModel.findById(tour._id).session(session)
			responseData = {
				booking,
				tour: updatedTour,
				wallet: { bonusBalance: user.bonusBalance },
				availableSeats: Math.max(0, seats - slot.bookedSeats),
			}
		})

		return res.status(201).json({ data: responseData })
	} catch (error) {
		const statusCode = error.statusCode || 500
		return res.status(statusCode).json({ message: error.message || "Ошибка при бронировании тура" })
	} finally {
		await session.endSession()
	}
}
