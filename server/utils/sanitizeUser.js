export const sanitizeUser = (user) => {
	if (!user) return null

	const source = typeof user.toObject === "function" ? user.toObject() : user
	const { password, verificationCode, __v, ...safeUser } = source

	return safeUser
}
