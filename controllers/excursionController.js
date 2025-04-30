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

export const getOneExcursion = async (req, res) => {
	try {
		const { excursionId } = req.params

		const excursion = await ExcursionModel.findById(excursionId)

		if (!excursion) {
			return res.status(404).json({ message: "Экскурсия не найдена" })
		}

		res.json({ data: excursion })
	} catch (error) {
		console.error("Ошибка:", error.message)
		res.status(500).json({ message: "Ошибка при получении элемента экскурсии" })
	}
}

export const getOneExcursionItem = async (req, res) => {
	try {
		const { excursionId, itemId } = req.params

		const excursion = await ExcursionModel.findById(excursionId)

		if (!excursion) {
			return res.status(404).json({ message: "Экскурсия не найдена" })
		}

		const item = excursion.items.find((item) => item._id.toString() === itemId)

		if (!item) {
			return res.status(404).json({ message: "Элемент экскурсии не найден" })
		}

		res.json({ data: item })
	} catch (error) {
		console.error("Ошибка:", error.message)
		res.status(500).json({ message: "Ошибка при получении элемента экскурсии" })
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


export const addExcursionItem = async (req, res) => {
	try {
		const { excursionId } = req.params
		const newItem = req.body // объект с title, images, content

		const updated = await ExcursionModel.findByIdAndUpdate(
			excursionId,
			{ $push: { items: newItem } },
			{ new: true }
		)

		if (!updated) {
			return res.status(404).json({ message: "Экскурсия не найдена" })
		}

		res.json(updated)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Ошибка при добавлении пункта" })
	}
}
