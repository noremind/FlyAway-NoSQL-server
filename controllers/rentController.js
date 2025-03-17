import RentModel from "../models/Rent.js"

export const getRents = async (req, res) => {
	try {
		const rents = await RentModel.find().populate("item")
		res.json({ data: rents })
	} catch (error) {
		res.status(500).json({
			message: "Ошибка при получении аренды",
		})
		console.error(error)
	}
}

export const getOneRent = async (req, res) => {
	try {
		const { id } = req.params

		const rent = await RentModel.findById(id).populate("item")

		if (!rent) {
			return res.status(404).json({ message: "Аренда не найдена" })
		}

		res.json(rent)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Ошибка при получении аренды" })
	}
}

export const createRents = async (req, res) => {
	try {
		const { item, itemType, user, startDate, endDate } = req.body

		const validTypes = ["Yacht", "Car"]
		if (!validTypes.includes(itemType)) {
			return res.status(400).json({ message: "Некорректный тип аренды" })
		}

		const rent = new RentModel({ item, itemType, user, startDate, endDate })
		await rent.save()

		res.status(201).json({ message: "Аренда успешно создана", data: { rent } })
	} catch (error) {
		res.status(500).json({ message: "Ошибка при создании аренды", error })
		console.error(error)
	}
}
