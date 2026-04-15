import bcrypt from "bcrypt"
import UserModel from "../../../models/User.js"
import { sanitizeUser } from "../../../utils/sanitizeUser.js"

const allowedRoles = ["admin", "user", "partner"]

export const postCreateUser = async (req, res) => {
	try {
		const { name, email, password, phone } = req.body
		const role = allowedRoles.includes(req.body.role) ? req.body.role : "user"
		const normalizedEmail = email?.trim().toLowerCase()
		const normalizedPhone = phone ? String(phone).replace(/\D/g, "") : null

		if (!name?.trim() || !normalizedEmail) {
			return res.status(400).json({ message: "Name and email are required" })
		}

		const existingUser = await UserModel.findOne({
			$or: [
				{ email: normalizedEmail },
				...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
			],
		})

		if (existingUser) {
			return res.status(409).json({
				message: "User with this email or phone already exists",
			})
		}

		const userData = {
			name: name.trim(),
			email: normalizedEmail,
			role,
			isVerified: true,
			verificationCode: null,
		}

		if (normalizedPhone) {
			userData.phone = normalizedPhone
		}

		if (password) {
			userData.password = await bcrypt.hash(password, 10)
		}

		const user = await UserModel.create(userData)

		return res.status(201).json({ data: sanitizeUser(user) })
	} catch (error) {
		console.error("Create user error:", error)
		if (error.code === 11000) {
			const field = Object.keys(error.keyPattern || error.keyValue || {})[0]
			return res.status(409).json({
				message:
					field === "email"
						? "User with this email already exists"
						: "User with this phone already exists",
			})
		}

		return res.status(500).json({ message: "Failed to create user" })
	}
}
