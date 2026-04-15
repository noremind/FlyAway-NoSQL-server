import jwt from "jsonwebtoken"

const getJwtSecret = () => {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is not configured")
	}

	return process.env.JWT_SECRET
}

export const createAuthToken = (user, payload = {}) => {
	return jwt.sign(
		{
			userId: user._id,
			role: payload.role || user.role,
			...payload,
		},
		getJwtSecret(),
		{ expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
	)
}

export const verifyAuthToken = (token) => jwt.verify(token, getJwtSecret())
