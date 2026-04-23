import HotelModel from "../models/Hotel.js"
import HotelRequestModel from "../models/HotelRequest.js"
import TourModel from "../models/Tour.js"
import UserModel from "../models/User.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const parseBookingDate = (value) => {
	const text = normalizeString(value)

	if (!text) {
		return null
	}

	const parsed = /^\d{4}-\d{2}-\d{2}$/.test(text)
		? new Date(`${text}T00:00:00`)
		: new Date(text)

	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const deriveBookingStatus = (booking) => {
	const currentStatus = normalizeString(booking?.status) || "active"

	if (currentStatus !== "active") {
		return currentStatus
	}

	const parsedDate = parseBookingDate(booking?.date)

	if (!parsedDate) {
		return currentStatus
	}

	return parsedDate.getTime() < Date.now() - 24 * 60 * 60 * 1000
		? "completed"
		: currentStatus
}

const deriveHotelRequestStatus = (request) => {
	const currentStatus = normalizeString(request?.status)

	if (currentStatus === "closed") {
		return "completed"
	}

	if (currentStatus === "cancelled") {
		return "cancelled"
	}

	return "active"
}

const serializeBooking = (booking) => {
	const source = typeof booking?.toObject === "function" ? booking.toObject() : booking

	return {
		...source,
		status: deriveBookingStatus(source),
	}
}

const serializeHotelRequest = (request) => {
	const source = typeof request?.toObject === "function" ? request.toObject() : request

	return {
		...source,
		requestStatus: normalizeString(source?.status) || "new",
		status: deriveHotelRequestStatus(source),
	}
}

export const getWallet = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" })
		}

		return res.json({
			data: {
				balance: 0,
				bonusBalance: Math.max(0, Number(user.bonusBalance) || 0),
				currency: "KZT",
				transactions: Array.isArray(user.walletTransactions)
					? [...user.walletTransactions].sort(
						(left, right) =>
							new Date(right.createdAt || 0).getTime() -
							new Date(left.createdAt || 0).getTime()
					)
					: [],
			},
		})
	} catch (error) {
		console.error("Get wallet error:", error)
		return res.status(500).json({ message: "Failed to get wallet" })
	}
}

export const getFavouriteTours = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId).populate({
			path: "favouriteTours",
			populate: { path: "partner" },
		})

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" })
		}

		return res.json({
			data: Array.isArray(user.favouriteTours) ? user.favouriteTours : [],
		})
	} catch (error) {
		console.error("Get favourite tours error:", error)
		return res.status(500).json({ message: "Не удалось получить избранное" })
	}
}

export const getFavouriteHotels = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId).populate({
			path: "favouriteHotels",
			populate: { path: "partner" },
		})

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" })
		}

		return res.json({
			data: Array.isArray(user.favouriteHotels) ? user.favouriteHotels : [],
		})
	} catch (error) {
		console.error("Get favourite hotels error:", error)
		return res.status(500).json({ message: "Не удалось получить избранные отели" })
	}
}

export const toggleFavouriteTour = async (req, res) => {
	try {
		const tourId = normalizeString(req.params.tourId)
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" })
		}

		const tour = await TourModel.findById(tourId)

		if (!tour) {
			return res.status(404).json({ message: "Тур не найден" })
		}

		const currentIds = Array.isArray(user.favouriteTours)
			? user.favouriteTours.map((item) => String(item))
			: []
		const isFavourite = currentIds.includes(tourId)

		user.favouriteTours = isFavourite
			? user.favouriteTours.filter((item) => String(item) !== tourId)
			: [tour._id, ...user.favouriteTours.filter(Boolean)]

		await user.save()

		const refreshedUser = await UserModel.findById(req.userId).populate({
			path: "favouriteTours",
			populate: { path: "partner" },
		})

		return res.json({
			data: {
				isFavourite: !isFavourite,
				favourites: refreshedUser?.favouriteTours || [],
			},
		})
	} catch (error) {
		console.error("Toggle favourite tour error:", error)
		return res.status(500).json({ message: "Не удалось обновить избранное" })
	}
}

export const toggleFavouriteHotel = async (req, res) => {
	try {
		const hotelId = normalizeString(req.params.hotelId)
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" })
		}

		const hotel = await HotelModel.findById(hotelId)

		if (!hotel) {
			return res.status(404).json({ message: "Отель не найден" })
		}

		const currentIds = Array.isArray(user.favouriteHotels)
			? user.favouriteHotels.map((item) => String(item))
			: []
		const isFavourite = currentIds.includes(hotelId)

		user.favouriteHotels = isFavourite
			? user.favouriteHotels.filter((item) => String(item) !== hotelId)
			: [hotel._id, ...user.favouriteHotels.filter(Boolean)]

		await user.save()

		const refreshedUser = await UserModel.findById(req.userId).populate({
			path: "favouriteHotels",
			populate: { path: "partner" },
		})

		return res.json({
			data: {
				isFavourite: !isFavourite,
				favourites: refreshedUser?.favouriteHotels || [],
			},
		})
	} catch (error) {
		console.error("Toggle favourite hotel error:", error)
		return res.status(500).json({ message: "Не удалось обновить избранные отели" })
	}
}

export const getTourBookings = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId).populate({
			path: "tourBookings.tour",
			populate: { path: "partner" },
		})

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" })
		}

		const bookings = Array.isArray(user.tourBookings) ? user.tourBookings : []

		return res.json({
			data: bookings
				.map(serializeBooking)
				.sort(
					(left, right) =>
						new Date(right.createdAt || 0).getTime() -
						new Date(left.createdAt || 0).getTime()
				),
		})
	} catch (error) {
		console.error("Get tour bookings error:", error)
		return res.status(500).json({ message: "Не удалось получить мои туры" })
	}
}

export const getHotelRequests = async (req, res) => {
	try {
		const requests = await HotelRequestModel.find({ createdBy: req.userId })
			.sort({ createdAt: -1 })
			.populate({
				path: "hotel",
				populate: { path: "partner" },
			})
			.populate("partner")

		return res.json({
			data: Array.isArray(requests)
				? requests.map(serializeHotelRequest)
				: [],
		})
	} catch (error) {
		console.error("Get hotel requests error:", error)
		return res.status(500).json({ message: "Не удалось получить мои отели" })
	}
}

export const cancelOwnHotelRequest = async (req, res) => {
	try {
		const request = await HotelRequestModel.findById(req.params.bookingId)
			.populate({
				path: "hotel",
				populate: { path: "partner" },
			})
			.populate("partner")

		if (!request) {
			return res.status(404).json({ message: "Заявка на отель не найдена" })
		}

		if (String(request.createdBy || "") !== String(req.userId)) {
			return res.status(403).json({ message: "Нет доступа к заявке" })
		}

		if (normalizeString(request.status) === "cancelled") {
			return res.status(409).json({ message: "Заявка уже отменена" })
		}

		if (normalizeString(request.status) === "closed") {
			return res.status(409).json({ message: "Завершенную заявку отменить нельзя" })
		}

		request.status = "cancelled"
		await request.save()

		const updatedRequest = await HotelRequestModel.findById(request._id)
			.populate({
				path: "hotel",
				populate: { path: "partner" },
			})
			.populate("partner")

		return res.json({
			message: "Заявка отменена",
			data: serializeHotelRequest(updatedRequest),
		})
	} catch (error) {
		console.error("Cancel hotel request error:", error)
		return res.status(500).json({ message: "Не удалось отменить заявку" })
	}
}
