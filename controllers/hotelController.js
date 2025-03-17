import HotelModel from "../models/Hotel.js"

export const getHotels = async (req, res) => {
	try {
		const hotels = await HotelModel.find()
		res.json({ data: hotels })
	} catch (error) {
		console.error("error")
		res.status(500).json({
			message: "Ошибка при получении отелей",
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
