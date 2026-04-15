import bcrypt from "bcrypt"
import UserModel from "../../../models/User.js"
import { createAuthToken } from "../../../utils/authToken.js"
import { sanitizeUser } from "../../../utils/sanitizeUser.js"

const allowedPublicRoles = ["user"]

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email)

export const postRegister = async (req, res) => {
	try {
		const { name, email, password, phone } = req.body
		const role = allowedPublicRoles.includes(req.body.role) ? req.body.role : "user"
		const normalizedEmail = email?.trim().toLowerCase()
		const normalizedPhone = phone ? String(phone).replace(/\D/g, "") : null

		if (!name?.trim() || !normalizedEmail || !password) {
			return res.status(400).json({
				message: "Name, email and password are required",
			})
		}

		if (!isValidEmail(normalizedEmail)) {
			return res.status(400).json({ message: "Email is invalid" })
		}

		if (password.length < 6) {
			return res.status(400).json({
				message: "Password must contain at least 6 characters",
			})
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

		const hashedPassword = await bcrypt.hash(password, 10)
		const userData = {
			name: name.trim(),
			email: normalizedEmail,
			password: hashedPassword,
			role,
			isVerified: true,
			verificationCode: null,
		}

		if (normalizedPhone) {
			userData.phone = normalizedPhone
		}

		const user = await UserModel.create(userData)

		const token = createAuthToken(user)

		return res.status(201).json({
			message: "Registration completed",
			token,
			user: sanitizeUser(user),
		})
	} catch (error) {
		console.error("Register error:", error)
		if (error.code === 11000) {
			const field = Object.keys(error.keyPattern || error.keyValue || {})[0]
			return res.status(409).json({
				message:
					field === "email"
						? "User with this email already exists"
						: "User with this phone already exists",
			})
		}

		return res.status(500).json({ message: "Registration failed" })
	}
}
