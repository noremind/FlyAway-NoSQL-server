import HotelModel from "../models/Hotel.js"

export const getHotels = async (req, res) => {
	try {
		const hotel = await HotelModel.find()
		res.json(hotel)
	} catch (error) {
		console.error("❌ Ошибка получения отелей:", error)
		res.status(500).json({
			message: "Get hotels is failed",
		})
	}
}
