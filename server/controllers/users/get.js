import UserModel from "../../models/User.js"
import { sanitizeUser } from "../../utils/sanitizeUser.js"

export const getUsers = async (req, res) => {
	try {
		const users = await UserModel.find().sort({ createdAt: -1 })

		return res.json({
			data: users.map(sanitizeUser),
		})
	} catch (error) {
		console.error("Get users error:", error)
		return res.status(500).json({ message: "Failed to get users" })
	}
}
