export const getMe = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(404).json({ message: "User was not found" })
		}

		return res.json({ data: req.user })
	} catch (error) {
		console.error("Get me error:", error)
		return res.status(500).json({ message: "Failed to get current user" })
	}
}
