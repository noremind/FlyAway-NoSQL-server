import ExcursionModel from "../models/Excursion.js"

export const getExcursions = async (req, res) => {
	try {
		const excursions = await ExcursionModel.find()
		res.json({ data: excursions })
	} catch (error) {
		console.error("error")
		res.status(500).json({
			message: "Ошибка при получении экскурсии",
		})
	}
}

export const createExcursion = async (req, res) => {
	try {
		const doc = new ExcursionModel({
			title: req.body.title,
			image: req.body.image,
			items: req.body.items,
		})

		const excursion = await doc.save()
		res.json({ data: excursion })
	} catch (error) {
		res.status(500).json({
			message: "Ошибка при создании экскурсии",
		})
	}
}
