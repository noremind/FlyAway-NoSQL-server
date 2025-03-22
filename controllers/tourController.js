import TourModel from "../models/Tour.js"

export const getTours = async (req, res) => {
	try {
		const tours = await TourModel.find()
		res.json({ data: tours })
	} catch (error) {
		res.status(500).json({
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
		console.error("Ошибка при получении партнеров:", error)
		res.status(500).json({
			message: "Ошибка при получении партнеров",
		})
	}
}

export const createTour = async (req, res) => {
	try {
		const doc = new TourModel({
			title: req.body.title,
			description: req.body.description,
			avatar: req.body.avatar,
			rating: req.body.rating,
			price: req.body.price,
			discount: req.body.discount,
			is_hot: req.body.is_hot,
      images: req.body.images,
			partner: req.body.partner,
			hotels: req.body.hotels,
		})

		const tour = await doc.save()
		res.json({ data: tour })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Ошибка при создании тура",
		})
	}
}
