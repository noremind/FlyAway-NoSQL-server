import CarModel from "../models/Car.js"

export const getCars = async (req, res) => {
	try {
		const cars = await CarModel.find()
		res.json({ data: cars })
	} catch (error) {
		res.status(500).json({
			message: "Ошибка при получении аренды",
		})
		console.error(error)
	}
}

export const getOneCar = async (req, res) => {
	try {
		const { id } = req.params

		const car = await CarModel.findById(id)

		if (!car) {
			return res.status(404).json({
				message: "Машина не найдена",
			})
		}

		res.json(car)
	} catch (error) {
		res.status(500).json({
			message: "Ошибка при получении яхты",
		})
		console.error(error)
	}
}


export const createCars = async (req, res) => {
	try {
		const car = new CarModel({
			title: req.body.title,
			description: req.body.description,
			price: req.body.price,
			old_price: req.body.old_price,
			content: req.body.content,
			images: req.body.images,
		})
		await car.save()

		res.status(201).json({ message: "Аренда успешно создана", data: { car } })
	} catch (error) {
		res.status(500).json({ message: "Ошибка при создании аренды", error })
		console.error(error)
	}
}
