import HotelModel from "../models/Hotel.js"

export const getHotels = async (req, res) => {
	try {
		const hotel = await HotelModel.find()
		res.json({ data: hotel })
	} catch (error) {
		console.error("❌ Ошибка получения отелей:", error)
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
		const doc = new HotelModel({
			name: req.body.name,
			// tour: req.body.tour,
			partner: req.body.partner,
			description: req.body.description,
			rating: req.body.rating,
			images: req.body.images,
			location: req.body.location,
			content: req.body.content,
		})

		const hotel = await doc.save()
		res.json({ data: hotel })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Ошибка при создании отеля",
		})
	}
}
