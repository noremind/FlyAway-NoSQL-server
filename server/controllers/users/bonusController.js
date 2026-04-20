import UserModel from "../../models/User.js"
import { sanitizeUser } from "../../utils/sanitizeUser.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

export const creditUserBonus = async (req, res) => {
	try {
		const amount = Math.max(0, Number(req.body.amount) || 0)
		const note = normalizeString(req.body.note)

		if (!amount) {
			return res.status(400).json({ message: "Укажите сумму бонусов" })
		}

		const user = await UserModel.findById(req.params.id)

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" })
		}

		user.bonusBalance = Math.max(0, Number(user.bonusBalance) || 0) + amount
		user.walletTransactions.unshift({
			name: "Начисление бонусов",
			type: "Бонусы",
			amount,
			currency: "BONUS",
			note: note || "Начисление администратором",
		})

		await user.save()

		return res.json({
			message: "Бонусы начислены",
			data: sanitizeUser(user),
		})
	} catch (error) {
		console.error("Credit bonus error:", error)
		return res.status(500).json({ message: "Не удалось начислить бонусы" })
	}
}
