import bcrypt from "bcrypt"
import PartnerModel from "../models/Partner.js"
import UserModel from "../models/User.js"
import { createAuthToken } from "../utils/authToken.js"
import { sanitizePartner } from "../utils/sanitizePartner.js"
import { sanitizeUser } from "../utils/sanitizeUser.js"
import { uploadToBlob } from "../utils/uploadToBlob.js"

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"]
const requiredPartnerFields = [
	"title",
	"email",
	"phone",
	"password",
	"bin",
	"ownerName",
	"address",
]

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email)

const normalizePhone = (phone) =>
	phone ? String(phone).replace(/\D/g, "") : null

const buildDuplicateMessage = (error) => {
	const field = Object.keys(error.keyPattern || error.keyValue || {})[0]

	if (field === "email") return "Partner with this email already exists"
	if (field === "bin") return "Partner with this BIN already exists"
	if (field === "contacts.phone") {
		return "Partner with this phone already exists"
	}
	if (field === "title") return "Partner with this company already exists"

	return "Partner already exists"
}

const formatPartner = (partner) => {
	const safePartner = sanitizePartner(partner)
	const tours = Array.isArray(safePartner.tours) ? safePartner.tours : []

	return {
		...safePartner,
		logo: safePartner.logo || safePartner.avatar || null,
		tour_count: tours.length,
	}
}

const uploadLogoFromBody = async (logoFile, partnerId) => {
	if (!logoFile?.base64Data) return null

	const { fileName, mimeType, size, base64Data } = logoFile

	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		throw new Error("BLOB_READ_WRITE_TOKEN is not configured")
	}

	if (!allowedImageTypes.includes(mimeType)) {
		throw new Error("Logo must be a JPG, PNG or WEBP image")
	}

	const cleanBase64 = base64Data.includes(",")
		? base64Data.split(",")[1]
		: base64Data

	const buffer = Buffer.from(cleanBase64, "base64")
	const result = await uploadToBlob(
		{
			originalname: fileName || "logo.png",
			mimetype: mimeType,
			size: Number(size) || buffer.length,
			buffer,
		},
		`flyaway/partners/${partnerId}/logo`
	)

	return result.url
}

const buildPartnerPayload = (body, hashedPassword) => {
	const normalizedEmail = body.email?.trim().toLowerCase()
	const normalizedPhone = normalizePhone(body.phone)
	const logo = body.logo || body.avatar || null

	return {
		title: body.title?.trim(),
		description: body.description,
		email: normalizedEmail,
		password: hashedPassword,
		bin: body.bin ? String(body.bin).trim() : undefined,
		ownerName: body.ownerName?.trim(),
		avatar: logo,
		logo,
		contacts: {
			website: body.website || body.contacts?.website || null,
			address: body.address || body.contacts?.address || null,
			phone: normalizedPhone,
		},
	}
}

const validatePartnerRequest = (body, options = {}) => {
	for (const field of requiredPartnerFields) {
		if (options.allowMissingPassword && field === "password") continue
		if (!body[field]?.toString().trim()) {
			return `${field} is required`
		}
	}

	if (!isValidEmail(body.email?.trim().toLowerCase() || "")) {
		return "Email is invalid"
	}

	if (!options.allowMissingPassword && body.password.length < 6) {
		return "Password must contain at least 6 characters"
	}

	if (body.password && body.password.length < 6) {
		return "Password must contain at least 6 characters"
	}

	return null
}

export const getPartners = async (req, res) => {
	try {
		const partners = await PartnerModel.find()

		return res.json({
			data: partners.map(formatPartner),
		})
	} catch (error) {
		console.error("Get partners error:", error)
		return res.status(500).json({
			message: "Failed to get partners",
		})
	}
}

export const getOnePartner = async (req, res) => {
	try {
		const partner = await PartnerModel.findById(req.params.id)

		if (!partner) {
			return res.status(404).json({
				message: "Partner was not found",
			})
		}

		return res.json({
			data: formatPartner(partner),
		})
	} catch (error) {
		console.error("Get partner error:", error)
		return res.status(500).json({
			message: "Failed to get partner",
		})
	}
}

export const getCurrentPartner = async (req, res) => {
	try {
		if (!req.partnerId) {
			return res.status(404).json({ message: "Partner profile was not found" })
		}

		const partner = await PartnerModel.findById(req.partnerId)

		if (!partner) {
			return res.status(404).json({ message: "Partner profile was not found" })
		}

		return res.json({ data: formatPartner(partner) })
	} catch (error) {
		console.error("Get current partner error:", error)
		return res.status(500).json({ message: "Failed to get partner profile" })
	}
}

export const createPartner = async (req, res) => {
	try {
		const hashedPassword = req.body.password
			? await bcrypt.hash(req.body.password, 10)
			: undefined
		const payload = buildPartnerPayload(req.body, hashedPassword)

		payload.rating = req.body.rating
		payload.tours = req.body.tours
		payload.hotels = req.body.hotels
		payload.contacts = req.body.contacts || payload.contacts

		const partner = await PartnerModel.create(payload)
		return res.status(201).json({ data: formatPartner(partner) })
	} catch (error) {
		console.error("Create partner error:", error)

		if (error.code === 11000) {
			return res.status(409).json({ message: buildDuplicateMessage(error) })
		}

		return res.status(500).json({
			message: "Failed to create partner",
		})
	}
}

export const applyPartner = async (req, res) => {
	try {
		const validationError = validatePartnerRequest(req.body)

		if (validationError) {
			return res.status(400).json({ message: validationError })
		}

		const existingCreatedBy = await PartnerModel.findOne({
			createdBy: req.userId,
		})

		if (existingCreatedBy) {
			return res.status(409).json({
				message: "You already have a partner profile",
			})
		}

		const normalizedEmail = req.body.email.trim().toLowerCase()
		const normalizedPhone = normalizePhone(req.body.phone)
		const existingPartner = await PartnerModel.findOne({
			$or: [
				{ title: req.body.title.trim() },
				{ email: normalizedEmail },
				{ bin: String(req.body.bin).trim() },
				{ "contacts.phone": normalizedPhone },
			],
		})

		if (existingPartner) {
			return res.status(409).json({
				message: "Partner with these contacts already exists",
			})
		}

		if (req.body.logoFile?.base64Data && !process.env.BLOB_READ_WRITE_TOKEN) {
			return res.status(500).json({
				message: "BLOB_READ_WRITE_TOKEN is not configured",
			})
		}

		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		const partner = await PartnerModel.create({
			...buildPartnerPayload(req.body, hashedPassword),
			createdBy: req.userId,
		})

		const logoUrl = await uploadLogoFromBody(req.body.logoFile, partner._id)

		if (logoUrl) {
			partner.logo = logoUrl
			partner.avatar = logoUrl
			await partner.save()
		}

		const user = await UserModel.findByIdAndUpdate(
			req.userId,
			{ role: "partner" },
			{ new: true }
		)
		const token = createAuthToken(user, {
			role: "partner",
			partnerId: partner._id.toString(),
		})

		return res.status(201).json({
			message: "Partner profile created",
			token,
			user: {
				...sanitizeUser(user),
				role: "partner",
				partnerId: partner._id.toString(),
				partner: formatPartner(partner),
			},
			data: formatPartner(partner),
		})
	} catch (error) {
		console.error("Apply partner error:", error)

		if (error.code === 11000) {
			return res.status(409).json({ message: buildDuplicateMessage(error) })
		}

		return res.status(500).json({
			message: error.message || "Failed to create partner profile",
		})
	}
}

export const loginPartner = async (req, res) => {
	try {
		const { email, password } = req.body
		const normalizedEmail = email?.trim().toLowerCase()

		if (!normalizedEmail || !password) {
			return res.status(400).json({
				message: "Email and password are required",
			})
		}

		const partner = await PartnerModel.findOne({
			email: normalizedEmail,
		}).select("+password")

		if (!partner || !partner.password) {
			return res.status(400).json({ message: "Invalid email or password" })
		}

		const isValidPassword = await bcrypt.compare(password, partner.password)

		if (!isValidPassword) {
			return res.status(400).json({ message: "Invalid email or password" })
		}

		const user = await UserModel.findByIdAndUpdate(
			partner.createdBy,
			{ role: "partner" },
			{ new: true }
		)

		if (!user) {
			return res.status(404).json({ message: "Owner user was not found" })
		}

		const token = createAuthToken(user, {
			role: "partner",
			partnerId: partner._id.toString(),
		})

		return res.json({
			message: "Partner login completed",
			token,
			user: {
				...sanitizeUser(user),
				role: "partner",
				partnerId: partner._id.toString(),
				partner: formatPartner(partner),
			},
		})
	} catch (error) {
		console.error("Partner login error:", error)
		return res.status(500).json({ message: "Partner login failed" })
	}
}

export const updateCurrentPartner = async (req, res) => {
	try {
		if (!req.partnerId) {
			return res.status(404).json({ message: "Partner profile was not found" })
		}

		const validationError = validatePartnerRequest(req.body, {
			allowMissingPassword: true,
		})

		if (validationError) {
			return res.status(400).json({ message: validationError })
		}

		const update = buildPartnerPayload(req.body)

		if (req.body.password) {
			update.password = await bcrypt.hash(req.body.password, 10)
		} else {
			delete update.password
		}

		const logoUrl = await uploadLogoFromBody(req.body.logoFile, req.partnerId)

		if (logoUrl) {
			update.logo = logoUrl
			update.avatar = logoUrl
		}

		const partner = await PartnerModel.findByIdAndUpdate(req.partnerId, update, {
			new: true,
			runValidators: true,
		})

		if (!partner) {
			return res.status(404).json({ message: "Partner profile was not found" })
		}

		return res.json({
			message: "Partner profile updated",
			data: formatPartner(partner),
		})
	} catch (error) {
		console.error("Update partner profile error:", error)

		if (error.code === 11000) {
			return res.status(409).json({ message: buildDuplicateMessage(error) })
		}

		return res.status(500).json({
			message: error.message || "Failed to update partner profile",
		})
	}
}
