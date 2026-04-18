export const getWallet = async (req, res) => {
	try {
		return res.json({
			data: {
				balance: 0,
				bonusBalance: 0,
				currency: "KZT",
				transactions: [],
			},
		})
	} catch (error) {
		console.error("Get wallet error:", error)
		return res.status(500).json({ message: "Failed to get wallet" })
	}
}
