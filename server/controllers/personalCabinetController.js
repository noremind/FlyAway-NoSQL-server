import TourModel from "../models/Tour.js"
import UserModel from "../models/User.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
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
			data: bookings.sort(
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
