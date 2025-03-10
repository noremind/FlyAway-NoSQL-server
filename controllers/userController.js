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
			message: "Ошибка пи получении пользователя",
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
		const userId = req.userId
		const user = await UserModel.findById(req.userId)

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

		const {
			password,
			createdAt,
			updatedAt,
			verificationCode,
			__v,
			isVerified,
			...userData
		} = user._doc

		res.json({
			message: "Данные успешно обновлены",
			data: { ...userData },
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
				message: "Пользователь не найден",
			})
		}

		const isValidPassword = await bcrypt.compare(password, user.password)

		if (!isValidPassword) {
			return res.status(400).json({
				message: "Неправильный пароль или телефон",
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
			message: "Вы успешно вошли",
			token: token,
			phone,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Не удалось войти",
		})
	}
}

export const getUserInfo = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)
		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден",
			})
		}

		const {
			password,
			createdAt,
			updatedAt,
			verificationCode,
			__v,
			isVerified,
			...userData
		} = user._doc

		res.json({
			...userData,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			message: "Ошибка при получении пользователя",
		})
	}
}

// СБРОС ПАРОЛЯ
export const sendResetCode = async (req, res) => {
	try {
		const { phone } = req.body
		let user = await UserModel.findOne({ phone })

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" })
		}

		const verificationCode = generateVerificationCode()

		user = await UserModel.findOneAndUpdate(
			{ phone },
			{ $set: { verificationCode } },
			{ new: true }
		)

		res.json({
			message: "Код отправлен",
			phone: phone,
		})
	} catch (error) {
		res.status(500).json({ message: "Ошибка при отправке кода" })
	}
}

export const verifyResetCode = async (req, res) => {
	try {
		const { phone, code } = req.body

		const user = await UserModel.findOne({ phone })

		if (!user || user.verificationCode !== code) {
			return res.status(400).json({
				message: "Неверный код или неверный пароль",
			})
		}

		await user.save()

		res.json({
			message: "Код подтвержден",
		})
	} catch (error) {
		res.status(500).json({ message: "Ошибка при проверке кода" })
	}
}

export const resetPassword = async (req, res) => {
	try {
		const { phone, newPassword } = req.body

		const user = await UserModel.findOne({ phone })

		if (!user) {
			return res
				.status(400)
				.json({ message: "Пользователь не найден или не подтверждён" })
		}

		user.isVerified = true
		user.verificationCode = null // Код больше не нужен

		user.password = await bcrypt.hash(newPassword, 10)
		await user.save()

		res.json({
			message: "Новый пароль установлен.",
		})
	} catch (error) {
		res.status(500).json({ message: "Ошибка при сбросе пароля" })
	}
}
