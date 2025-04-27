import MedicineModel from "../models/Medicine.js"

export const getMedicine = async (req, res) => {
	try {
		const checkUps = await MedicineModel.find()
		res.json({ data: checkUps })
	} catch (error) {
		console.error("error")
		res.status(500).json({
			message: "Ошибка при получении анализа тела",
		})
	}
}

export const createMedicine = async (req, res) => {
	try {
		const doc = new MedicineModel({
			title: req.body.title,
			image: req.body.image,
		})

		const checkUp = await doc.save()
		res.json({ data: checkUp })
	} catch (error) {
		console.error("error")
		res.status(500).json({
			message: "Ошибка при создании анализа тела",
		})
	}
}
