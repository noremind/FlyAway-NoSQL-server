import PartnerModel from "../models/Partner.js"
import UserModel from "../models/User.js"
import { verifyAuthToken } from "../utils/authToken.js"
import { sanitizePartner } from "../utils/sanitizePartner.js"
import { sanitizeUser } from "../utils/sanitizeUser.js"

export const checkAuth = async (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1]

	if (!token) {
		return res.status(401).json({ message: "Authorization token is required" })
	}

	try {
		const decoded = verifyAuthToken(token)
		const user = await UserModel.findById(decoded.userId)

		if (!user) {
			return res.status(401).json({ message: "User was not found" })
		}

		let partner = null
		if (decoded.partnerId) {
			partner = await PartnerModel.findById(decoded.partnerId)

			if (!partner) {
				return res.status(401).json({ message: "Partner was not found" })
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
		req.user = {
			...sanitizeUser(user),
			role: sessionRole,
			...(safePartner
				? {
						partnerId: partner._id.toString(),
						partner: safePartner,
				  }
				: {}),
		}

		next()
	} catch (error) {
		return res.status(401).json({
			message: "Invalid or expired token",
			statusCode: 401,
		})
	}
}

export const requireAuth = checkAuth

export const requireRoles = (...roles) => {
	return (req, res, next) => {
		if (!req.userRole) {
			return res.status(401).json({ message: "Authorization is required" })
		}

		if (!roles.includes(req.userRole)) {
			return res.status(403).json({ message: "Forbidden" })
		}

		next()
	}
}

export const requireSelfOrRoles = (...roles) => {
	return (req, res, next) => {
		if (req.params.id === req.userId || roles.includes(req.userRole)) {
			return next()
		}

		return res.status(403).json({ message: "Forbidden" })
	}
}
