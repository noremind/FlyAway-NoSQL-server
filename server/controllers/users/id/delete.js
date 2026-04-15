import UserModel from "../../../models/User.js"

export const deleteUser = async (req, res) => {
	try {
		const user = await UserModel.findByIdAndDelete(req.params.id)

		if (!user) {
			return res.status(404).json({ message: "User was not found" })
		}

		return res.json({ message: "User deleted" })
	} catch (error) {
		console.error("Delete user error:", error)
		return res.status(500).json({ message: "Failed to delete user" })
	}
}
