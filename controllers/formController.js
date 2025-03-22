import { sendEmail } from "../utils/mail.service.js"
import FormModel from "../models/Form.js"
// import RentModel from "../models/Rent.js"
import CarModel from "../models/Car.js"
import YachtModel from "../models/Yacht.js"

export const submitForm = async (req, res) => {
	try {
		const { name, email, phone, comment, id, item_type } = req.body

		if (!name || !email || !phone || !comment || !item_type) {
			return res.status(400).json({ message: "Заполните все поля" })
		}

		let item
		if (item_type === "cars") {
			item = await CarModel.findById(id)
		} else if (item_type === "yachts") {
			item = await YachtModel.findById(id)
		}

		if (!item) {
			return res.status(404).json({ message: "Объект не найден" })
		}

		const newForm = new FormModel({
			id,
			name,
			email,
			phone,
			item_type,
			comment,
		})

		await newForm.save()

		const message = `
			<p><b>Новая заявка с сайта</b></p>

			<p><b>Продукт:</b><br>
			<b>Тип:</b> ${item_type}<br>
			<b>ID:</b> ${item._id}<br>
			<b>Название:</b> ${item.title}<br>
			<b>Цена:</b> ${item.price} ₽</p>

			<p><b>Пользователь:</b><br>
			<b>Имя:</b> ${name}<br>
			<b>Телефон:</b> ${phone}<br>
			<b>Email:</b> ${email}<br>
			<b>Комментарий:</b> ${comment}</p>
		`

		await sendEmail("isanartayuly@gmail.com", "Новая заявка с сайта", message)

		res.status(200).json({ message: "Форма успешно отправлена" })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Ошибка при отправке формы" })
	}
}
