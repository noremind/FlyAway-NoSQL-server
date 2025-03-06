import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET

export const checkAuth = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1]

	if (!token) {
		return res.status(401).json({ message: "Нет доступа" })
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY)
		req.userId = decoded.userId
		next()
	} catch (error) {
		return res.status(403).json({ message: "Неверный или истёкший токен" })
	}
}
