import UserModel from "../models/User.js"
import bcrypt from "bcrypt"

export const getUsers = async (req, res) => {
	try {
		const users = await UserModel.find()
		res.json(users)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Geting users is failed",
		})
	}
}

// Генерация случайного 4-значного кода
const generateVerificationCode = () =>
	Math.floor(1000 + Math.random() * 9000).toString()

// Регистрируем пользователя и отправляем код
export const sendVerificationCode = async (req, res) => {
	try {
		const { fullName, phone } = req.body

		let user = await UserModel.findOne({ phone })

		if (!user) {
			const verificationCode = generateVerificationCode()
			console.log(`🔹 Код подтверждения для ${phone}: ${verificationCode}`)

			user = new UserModel({ fullName, phone, verificationCode })
			await user.save()
		} else if (!user.isVerified) {
			user.verificationCode = generateVerificationCode()
			console.log(
				`🔹 Новый код подтверждения для ${phone}: ${user.verificationCode}`
			)
			await user.save()
		} else {
			return res.status(400).json({ message: "Этот номер уже зарегистрирован" })
		}

		res.json({ message: "Код отправлен", phone, code: `${user.verificationCode}` })
	} catch (error) {
		res.status(500).json({ message: "Ошибка при отправке кода" })
	}
}

export const verifyCode = async (req, res) => {
	try {
		const { phone, code } = req.body

		const user = await UserModel.findOne({ phone })

		if (!user || user.verificationCode !== code) {
			return res.status(400).json({ message: "Неверный код" })
		}

		user.isVerified = true
		user.verificationCode = null // Код больше не нужен
		await user.save()

		res.json({ message: "Телефон подтверждён", userId: user._id })
	} catch (error) {
		res.status(500).json({ message: "Ошибка при проверке кода" })
	}
}

export const setPassword = async (req, res) => {
	try {
		const { userId, password } = req.body

		const user = await UserModel.findById(userId)

		if (!user || !user.isVerified) {
			return res
				.status(400)
				.json({ message: "Пользователь не найден или не подтверждён" })
		}

		user.password = await bcrypt.hash(password, 10)
		await user.save()

		res.json({ message: "Пароль установлен. Теперь можно войти." })
	} catch (error) {
		res.status(500).json({ message: "Ошибка при установке пароля" })
	}
}

export const updateUser = async (req, res) => {
	try {
		const { userId } = req.params

		// Обновляем только переданные поля
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ $set: req.body }, // Только переданные поля изменяются
			{ new: true, runValidators: true } // Возвращает обновленный объект
		)

		if (!updatedUser) {
			return res.status(404).json({
				message: "Пользователь не найден",
			})
		}

		// console.log("User updated:", updatedUser)

		res.json({
			message: "Данные успешно обновлены",
			user: updatedUser,
		})
	} catch (error) {
		console.error("Ошибка обновления пользователя:", error)
		res.status(500).json({
			message: "Ошибка при обновлении данных пользователя",
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne()
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Login is failed",
		})
	}
}
