import UserModel from "../../../models/User.js"
import { sanitizeUser } from "../../../utils/sanitizeUser.js"

export const getUserById = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.id)

		if (!user) {
			return res.status(404).json({ message: "User was not found" })
		}

		return res.json({ data: sanitizeUser(user) })
	} catch (error) {
		console.error("Get user by id error:", error)
		return res.status(500).json({ message: "Failed to get user" })
	}
}
