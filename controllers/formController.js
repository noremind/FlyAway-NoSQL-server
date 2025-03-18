import { sendEmail } from "../utils/mail.service.js"
import FormModel from "../models/Form.js"

export const submitForm = async (req, res) => {
	try {
		const { name, email, phone, comment } = req.body

		if (!name || !email || !phone || !comment) {
			return res.status(400).json({ message: "Заполните все поля" })
		}

		const newForm = new FormModel({ name, email, phone, comment })
		await newForm.save()

		// Формируем текст письма
		const message = `
			Новая заявка с сайта:
			Имя: ${name}
			Email: ${email}
			Телефон: ${phone}
			Комментарий: ${comment}
		`

		// Отправляем на почту менеджера
		await sendEmail("isanartayuly@gmail.com", "Новая заявка с сайта", message)

		res.status(200).json({ message: "Форма успешно отправлена" })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Ошибка при отправке формы" })
	}
}
