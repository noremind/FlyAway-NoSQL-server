import bcrypt from "bcrypt"
import UserModel from "../../../models/User.js"
import PartnerModel from "../../../models/Partner.js"
import { createAuthToken } from "../../../utils/authToken.js"
import { sanitizeUser } from "../../../utils/sanitizeUser.js"
import { sanitizePartner } from "../../../utils/sanitizePartner.js"

const buildPartnerUser = (owner, partner) => {
	const safePartner = sanitizePartner(partner)
	const safeOwner = sanitizeUser(owner)

	return {
		_id: safePartner._id,
		name: safePartner.title,
		email: safePartner.email || safeOwner.email,
		avatar: safePartner.logo || safePartner.avatar || safeOwner.avatar || null,
		role: "partner",
		partnerId: safePartner._id.toString(),
		ownerId: safeOwner._id,
		owner: safeOwner,
		partner: safePartner,
	}
}

export const postLogin = async (req, res) => {
	try {
		const { email, password } = req.body
		const normalizedEmail = email?.trim().toLowerCase()

		if (!normalizedEmail || !password) {
			return res.status(400).json({ message: "Введите почту и пароль" })
		}

		const partner = await PartnerModel.findOne({ email: normalizedEmail }).select("+password")

		if (partner?.password) {
			const isPartnerPasswordValid = await bcrypt.compare(password, partner.password)

			if (isPartnerPasswordValid) {
				const owner = await UserModel.findById(partner.createdBy)

				if (!owner) {
					return res.status(404).json({ message: "Владелец партнерского аккаунта не найден" })
				}

				const authToken = createAuthToken(owner, {
					role: "partner",
					partnerId: partner._id.toString(),
				})

				return res.json({
					message: "Вход в партнерский аккаунт выполнен",
					token: authToken,
					user: buildPartnerUser(owner, partner),
				})
			}
		}

		const user = await UserModel.findOne({ email: normalizedEmail })

		if (!user || !user.password) {
			return res.status(400).json({ message: "Неверная почта или пароль" })
		}

		const isValidPassword = await bcrypt.compare(password, user.password)

		if (!isValidPassword) {
			return res.status(400).json({ message: "Неверная почта или пароль" })
		}

		const authToken = createAuthToken(user)

		return res.json({
			message: "Вход выполнен",
			token: authToken,
			user: sanitizeUser(user),
		})
	} catch (error) {
		console.error("Login error:", error)
		return res.status(500).json({ message: "Не удалось выполнить вход" })
	}
}
