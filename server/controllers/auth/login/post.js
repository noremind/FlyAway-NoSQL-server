import bcrypt from "bcrypt"
import UserModel from "../../../models/User.js"
import { createAuthToken } from "../../../utils/authToken.js"
import { sanitizeUser } from "../../../utils/sanitizeUser.js"

export const postLogin = async (req, res) => {
	try {
		const { email, password } = req.body
		const normalizedEmail = email?.trim().toLowerCase()

		if (!normalizedEmail || !password) {
			return res.status(400).json({
				message: "Email and password are required",
			})
		}

		const user = await UserModel.findOne({ email: normalizedEmail })

		if (!user || !user.password) {
			return res.status(400).json({ message: "Invalid email or password" })
		}

		const isValidPassword = await bcrypt.compare(password, user.password)

		if (!isValidPassword) {
			return res.status(400).json({ message: "Invalid email or password" })
		}

		const token = createAuthToken(user)

		return res.json({
			message: "Login completed",
			token,
			user: sanitizeUser(user),
		})
	} catch (error) {
		console.error("Login error:", error)
		return res.status(500).json({ message: "Login failed" })
	}
}
