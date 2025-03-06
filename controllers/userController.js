import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET

export const getUsers = async (req, res) => {
	try {
		const users = await UserModel.find()
		res.json({
			data: users,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Geting users is failed",
		})
	}
}

const generateVerificationCode = () =>
	Math.floor(1000 + Math.random() * 9000).toString()

export const sendVerificationCode = async (req, res) => {
	try {
		const { name, phone } = req.body

		let user = await UserModel.findOne({ phone })

		if (!user) {
			const verificationCode = generateVerificationCode()
			console.log(`🔹 Код подтверждения для ${phone}: ${verificationCode}`)

			user = new UserModel({ name, phone, verificationCode })
			await user.save()
		} else if (!user.isVerified) {
			const verificationCode = generateVerificationCode()

			user = await UserModel.findByIdAndUpdate(
				user._id,
				{ $set: { ...req.body, verificationCode } },
				{ new: true }
			)
		} else {
			return res.status(400).json({ message: "Этот номер уже зарегистрирован" })
		}

		res.json({
			message: "Код отправлен",
			phone,
			code: `${user.verificationCode}`,
		})
	} catch (error) {
		res.status(500).json({ message: "Ошибка при отправке кода" })
	}
}

export const verifyCode = async (req, res) => {
	try {
		const { phone, code } = req.body

		const user = await UserModel.findOne({ phone })

		if (!user || user.verificationCode !== code) {
			return res
				.status(400)
				.json({ message: "Неверный код или неверный номер" })
		}
		// else if (!user.password) {
		// 	user.isVerified = false
		// }

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

		if (!user) {
			return res
				.status(400)
				.json({ message: "Пользователь не найден или не подтверждён" })
		}

		user.isVerified = true
		user.verificationCode = null // Код больше не нужен
		user.password = await bcrypt.hash(password, 10)
		await user.save()

		const token = jwt.sign(
			{ userId: userId }, // Полезная информация в токене
			SECRET_KEY,
			{ expiresIn: "7d" }
		)

		res.json({
			token,
			message: "Пароль установлен. Теперь можно войти.",
		})
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
		const { phone, password } = req.body

		const user = await UserModel.findOne({ phone })

		if (!user) {
			return res.status(400).json({
				message: "User not founnd",
			})
		}

		const isValidPassword = await bcrypt.compare(password, user.password)

		if (!isValidPassword) {
			return res.status(400).json({
				message: "Incorrect password",
			})
		}

		const token = jwt.sign(
			{
				userId: user._id,
			},
			SECRET_KEY,
			{
				expiresIn: "7d",
			}
		)

		res.json({
			message: "Login is success",
			token: token,
			phone,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Login is failed",
		})
	}
}

export const getProfile = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		// console.log("user", user)

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			})
		}

		res.json(user)
	} catch (error) {
		console.error(error)
		res.status(500).json({
			message: "Ошибка при получении пользователя",
		})
	}
}
