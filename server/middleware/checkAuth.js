import PartnerModel from "../models/Partner.js"
import UserModel from "../models/User.js"
import { verifyAuthToken } from "../utils/authToken.js"
import { sanitizePartner } from "../utils/sanitizePartner.js"
import { sanitizeUser } from "../utils/sanitizeUser.js"

const makePartnerSessionUser = (owner, partner) => {
	const safeOwner = sanitizeUser(owner)
	const safePartner = sanitizePartner(partner)

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

export const checkAuth = async (req, res, next) => {
	const accessToken = req.headers.authorization?.split(" ")[1]

	if (!accessToken) {
		return res.status(401).json({ message: "Требуется авторизация" })
	}

	try {
		const decoded = verifyAuthToken(accessToken)
		const user = await UserModel.findById(decoded.userId)

		if (!user) {
			return res.status(401).json({ message: "Пользователь не найден" })
		}

		let partner = null
		if (decoded.partnerId) {
			partner = await PartnerModel.findById(decoded.partnerId)

			if (!partner) {
				return res.status(401).json({ message: "Партнер не найден" })
			}
		}

		if (!partner && user.role === "partner") {
			partner = await PartnerModel.findOne({ createdBy: user._id })
		}

		const sessionRole = partner ? "partner" : user.role
		const safePartner = sanitizePartner(partner)

		req.userId = user._id.toString()
		req.userRole = sessionRole
		req.partnerId = partner?._id.toString()
		req.partner = safePartner
		req.user = partner ? makePartnerSessionUser(user, partner) : sanitizeUser(user)

		next()
	} catch (error) {
		return res.status(401).json({
			message: "Сессия недействительна или истекла",
			statusCode: 401,
		})
	}
}

export const requireAuth = checkAuth

export const requireRoles = (...roles) => {
	return (req, res, next) => {
		if (!req.userRole) {
			return res.status(401).json({ message: "Необходима авторизация" })
		}

		if (!roles.includes(req.userRole)) {
			return res.status(403).json({ message: "Недостаточно прав" })
		}

		next()
	}
}

export const requireSelfOrRoles = (...roles) => {
	return (req, res, next) => {
		if (req.params.id === req.userId || roles.includes(req.userRole)) {
			return next()
		}

		return res.status(403).json({ message: "Недостаточно прав" })
	}
}
