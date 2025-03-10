import express from "express"
import {
	sendVerificationCode,
	verifyCode,
	setPassword,
	getUsers,
	updateUser,
	login,
	getUserInfo,
	sendResetCode,
	verifyResetCode,
	resetPassword,
} from "../controllers/userController.js"
import { checkAuth } from "../utils/checkAuth.middleware.js"

export const userRoutes = express.Router()

userRoutes.get("/", getUsers)

// 1. Отправка кода
userRoutes.post("/auth/register/send-code", sendVerificationCode)

// 2. Проверка кода
userRoutes.post("/auth/register/verify-code", verifyCode)

// 3. Установка пароля
userRoutes.post("/auth/register/set-password", setPassword)
userRoutes.put("/update", checkAuth, updateUser)
userRoutes.post("/auth/login", login)
userRoutes.get("/current-info", checkAuth, getUserInfo)

// Reset password
userRoutes.post("/send-reset-code", sendResetCode)
userRoutes.post("/verify-reset-code", verifyResetCode)
userRoutes.post("/reset-password", resetPassword)
