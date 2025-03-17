import YachtModel from "../models/Yacht.js"

export const getYachts = async (req, res) => {
	try {
		const yachts = await YachtModel.find()
		res.json({ data: yachts })
	} catch (error) {
		console.error(error)
		res.status(500).json({
			message: "Ошибка при получении аренды",
		})
	}
}

export const getOneYacht = async (req, res) => {
	try {
		const { id } = req.params

		const yacht = await YachtModel.findById(id)

		if (!yacht) {
			return res.status(404).json({
				message: "Яхта не найдена",
			})
		}

		res.json(yacht)
	} catch (error) {
		res.status(500).json({
			message: "Ошибка при получении яхты",
		})
		console.error(error)
	}
}

export const createYacht = async (req, res) => {
	try {
		const yacht = new YachtModel({
			title: req.body.title,
			description: req.body.description,
			price: req.body.price,
			old_price: req.body.old_price,
			content: req.body.content,
			images: req.body.images,
		})
		await yacht.save()

		res.status(201).json({ message: "Аренда успешно создана", data: { yacht } })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Ошибка при создании аренды", error })
	}
}
