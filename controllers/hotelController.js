import HotelModel from "../models/Hotel.js"

export const getHotels = async (req, res) => {
	try {
		const hotel = await HotelModel.find()
		res.json({ data: hotel })
	} catch (error) {
		console.error("❌ Ошибка получения отелей:", error)
		res.status(500).json({
			message: "Get hotels is failed",
		})
	}
}

export const createHotel = async (req, res) => {
	try {
		const doc = new HotelModel({
			name: req.body.name,
			tour_company: req.body.tour_company,
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
			message: "Create hotel is failed",
		})
	}
}
