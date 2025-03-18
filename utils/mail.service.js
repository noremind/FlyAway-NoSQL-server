import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// Настройка транспорта (через Gmail)
const transporter = nodemailer.createTransport({
	host: "smtp.mail.ru", // SMTP сервер для VK Workspace
	port: 465, // 465 - SSL, 587 - TLS
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
})

export const sendEmail = async (to, subject, text) => {
	try {
		await transporter.sendMail({
			from: `"Сайт" <${process.env.EMAIL_USER}>`, // Отправитель
			to,
			subject,
			text,
		})
		console.log("✅ Email отправлен:", to)
	} catch (error) {
		console.error("❌ Ошибка при отправке email:", error)
		console.error("📩 Ответ сервера:", error.response)
	}
}

