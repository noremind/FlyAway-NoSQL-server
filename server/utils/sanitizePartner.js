export const sanitizePartner = (partner) => {
	if (!partner) return null

	const source =
		typeof partner.toObject === "function" ? partner.toObject() : partner
	const { password, __v, ...safePartner } = source

	return safePartner
}
