import express from "express"
import {
	sendVerificationCode,
	verifyCode,
	setPassword,
	getUsers,
	updateUser,
} from "../controllers/userController.js"

export const userRoutes = express.Router()

userRoutes.get("/", getUsers)

// 1. Отправка кода
userRoutes.post("/register/send-code", sendVerificationCode)

// 2. Проверка кода
userRoutes.post("/register/verify-code", verifyCode)

// 3. Установка пароля
userRoutes.post("/register/set-password", setPassword)



userRoutes.put("/:userId/update", updateUser)