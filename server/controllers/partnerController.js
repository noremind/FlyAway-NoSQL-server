import bcrypt from "bcrypt"
import PartnerModel from "../models/Partner.js"
import UserModel from "../models/User.js"
import { createAuthToken } from "../utils/authToken.js"
import { sanitizePartner } from "../utils/sanitizePartner.js"
import { sanitizeUser } from "../utils/sanitizeUser.js"
import { deleteFromBlob, uploadBase64File } from "../utils/uploadToBlob.js"

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"]
const requiredPartnerFields = ["title", "email", "phone", "password", "bin", "ownerName", "address"]
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email)
const normalizePhone = (phone) => phone ? String(phone).replace(/\D/g, "") : null
const normalizeString = (value) => value === null || value === undefined ? "" : String(value).trim()
const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const buildDuplicateMessage = (error) => {
	const field = Object.keys(error.keyPattern || error.keyValue || {})[0]
	if (field === "email") return "Партнер с такой почтой уже существует"
	if (field === "bin") return "Партнер с таким БИН уже существует"
	if (field === "contacts.phone") return "Партнер с таким телефоном уже существует"
	if (field === "title") return "Партнер с таким названием уже существует"
	return "Партнер уже существует"
}

const getArray = (value) => Array.isArray(value) ? value : []
const getAverage = (items) => {
	const ratings = getArray(items).map((item) => Number(item?.rating) || 0).filter((value) => value > 0)
	if (!ratings.length) return 0
	return Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
}

const getPartnerStats = (partner) => {
	const tours = getArray(partner?.tours)
	const hotels = getArray(partner?.hotels)
	const reviewCount = tours.reduce((sum, tour) => sum + (Number(tour?.reviewsCount) || 0), 0) + hotels.reduce((sum, hotel) => sum + (Number(hotel?.reviewsCount) || 0), 0)
	return {
		tour_count: tours.length,
		hotel_count: hotels.length,
		reviews_count: reviewCount,
		review_count: reviewCount,
		rating: getAverage([...tours, ...hotels]),
	}
}

const formatPartner = (partner) => {
	const safePartner = sanitizePartner(partner)
	const stats = getPartnerStats(safePartner)
	return {
		...safePartner,
		logo: safePartner.logo || safePartner.avatar || null,
		avatar: safePartner.avatar || safePartner.logo || null,
		...stats,
	}
}

const makePartnerSessionUser = (owner, partner) => {
	const safeOwner = sanitizeUser(owner)
	const safePartner = formatPartner(partner)
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

const uploadLogoFromBody = async (logoFile, partnerId) => {
	if (!logoFile?.base64Data) return null
	const { mimeType } = logoFile
	if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Токен хранилища файлов не настроен")
	if (!allowedImageTypes.includes(mimeType)) throw new Error("Логотип должен быть изображением JPG, PNG или WEBP")
	const result = await uploadBase64File(logoFile, { bucket: "partners", entityId: partnerId, scope: "logo" })
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
		if (!body[field]?.toString().trim()) return "Заполните обязательные поля партнера"
	}
	if (!isValidEmail(body.email?.trim().toLowerCase() || "")) return "Некорректная почта"
	if (!options.allowMissingPassword && body.password.length < 6) return "Пароль должен содержать минимум 6 символов"
	if (body.password && body.password.length < 6) return "Пароль должен содержать минимум 6 символов"
	return null
}

const partnerPopulate = [
	{ path: "tours", populate: { path: "partner", select: "title logo avatar rating" } },
	{ path: "hotels", populate: { path: "partner", select: "title logo avatar rating" } },
]

const sortPartners = (data, sortBy) => {
	const normalizedSort = normalizeString(sortBy) || "rating_desc"
	return [...data].sort((a, b) => {
		if (normalizedSort === "title_asc") return normalizeString(a.title).localeCompare(normalizeString(b.title), "ru")
		if (normalizedSort === "title_desc") return normalizeString(b.title).localeCompare(normalizeString(a.title), "ru")
		if (normalizedSort === "rating_asc") return (Number(a.rating) || 0) - (Number(b.rating) || 0)
		return (Number(b.rating) || 0) - (Number(a.rating) || 0)
	})
}

export const getPartners = async (req, res) => {
	try {
		const search = normalizeString(req.query.search)
		const sortBy = normalizeString(req.query.sortBy) || "rating_desc"
		const query = search ? { title: new RegExp(escapeRegExp(search), "i") } : {}
		const partners = await PartnerModel.find(query).populate(partnerPopulate)
		const data = sortPartners(partners.map(formatPartner), sortBy)
		return res.json({ data, meta: { search, sortBy } })
	} catch (error) {
		console.error("Get partners error:", error)
		return res.status(500).json({ message: "Не удалось получить список партнеров" })
	}
}

export const getOnePartner = async (req, res) => {
	try {
		const partner = await PartnerModel.findById(req.params.id).populate(partnerPopulate)
		if (!partner) return res.status(404).json({ message: "Партнер не найден" })
		return res.json({ data: formatPartner(partner) })
	} catch (error) {
		console.error("Get partner error:", error)
		return res.status(500).json({ message: "Не удалось получить партнера" })
	}
}

export const getCurrentPartner = async (req, res) => {
	try {
		if (!req.partnerId) return res.status(404).json({ message: "Партнерский профиль не найден" })
		const partner = await PartnerModel.findById(req.partnerId).populate(partnerPopulate)
		if (!partner) return res.status(404).json({ message: "Партнерский профиль не найден" })
		return res.json({ data: formatPartner(partner) })
	} catch (error) {
		console.error("Get current partner error:", error)
		return res.status(500).json({ message: "Не удалось получить профиль партнера" })
	}
}

export const createPartner = async (req, res) => {
	try {
		const hashedPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : undefined
		const payload = buildPartnerPayload(req.body, hashedPassword)
		payload.rating = req.body.rating
		payload.tours = req.body.tours
		payload.hotels = req.body.hotels
		payload.contacts = req.body.contacts || payload.contacts
		const partner = await PartnerModel.create(payload)
		return res.status(201).json({ data: formatPartner(partner) })
	} catch (error) {
		console.error("Create partner error:", error)
		if (error.code === 11000) return res.status(409).json({ message: buildDuplicateMessage(error) })
		return res.status(500).json({ message: "Не удалось создать партнера" })
	}
}

export const applyPartner = async (req, res) => {
	try {
		const validationError = validatePartnerRequest(req.body)
		if (validationError) return res.status(400).json({ message: validationError })
		const existingCreatedBy = await PartnerModel.findOne({ createdBy: req.userId })
		if (existingCreatedBy) return res.status(409).json({ message: "У вас уже есть партнерский профиль" })
		const normalizedEmail = req.body.email.trim().toLowerCase()
		const normalizedPhone = normalizePhone(req.body.phone)
		const existingPartner = await PartnerModel.findOne({ $or: [{ title: req.body.title.trim() }, { email: normalizedEmail }, { bin: String(req.body.bin).trim() }, { "contacts.phone": normalizedPhone }] })
		if (existingPartner) return res.status(409).json({ message: "Партнер с такими данными уже существует" })
		if (req.body.logoFile?.base64Data && !process.env.BLOB_READ_WRITE_TOKEN) return res.status(500).json({ message: "Токен хранилища файлов не настроен" })
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		const partner = await PartnerModel.create({ ...buildPartnerPayload(req.body, hashedPassword), createdBy: req.userId })
		const logoUrl = await uploadLogoFromBody(req.body.logoFile, partner._id)
		if (logoUrl) { partner.logo = logoUrl; partner.avatar = logoUrl; await partner.save() }
		return res.status(201).json({ message: "Партнерский профиль создан", data: formatPartner(partner) })
	} catch (error) {
		console.error("Apply partner error:", error)
		if (error.code === 11000) return res.status(409).json({ message: buildDuplicateMessage(error) })
		return res.status(500).json({ message: error.message || "Не удалось создать партнерский профиль" })
	}
}

export const loginPartner = async (req, res) => {
	try {
		const { email, password } = req.body
		const normalizedEmail = email?.trim().toLowerCase()
		if (!normalizedEmail || !password) return res.status(400).json({ message: "Введите почту и пароль" })
		const partner = await PartnerModel.findOne({ email: normalizedEmail }).select("+password")
		if (!partner || !partner.password) return res.status(400).json({ message: "Неверная почта или пароль" })
		const isValidPassword = await bcrypt.compare(password, partner.password)
		if (!isValidPassword) return res.status(400).json({ message: "Неверная почта или пароль" })
		const user = await UserModel.findById(partner.createdBy)
		if (!user) return res.status(404).json({ message: "Владелец партнерского аккаунта не найден" })
		const token = createAuthToken(user, { role: "partner", partnerId: partner._id.toString() })
		return res.json({ message: "Вход в партнерский аккаунт выполнен", token, user: makePartnerSessionUser(user, partner) })
	} catch (error) {
		console.error("Partner login error:", error)
		return res.status(500).json({ message: "Не удалось выполнить вход партнера" })
	}
}

export const updateCurrentPartner = async (req, res) => {
	try {
		if (!req.partnerId) return res.status(404).json({ message: "Партнерский профиль не найден" })
		const validationError = validatePartnerRequest(req.body, { allowMissingPassword: true })
		if (validationError) return res.status(400).json({ message: validationError })
		const currentPartner = await PartnerModel.findById(req.partnerId)
		if (!currentPartner) return res.status(404).json({ message: "Партнерский профиль не найден" })
		const update = buildPartnerPayload(req.body)
		if (req.body.password) update.password = await bcrypt.hash(req.body.password, 10)
		else delete update.password
		const logoUrl = await uploadLogoFromBody(req.body.logoFile, req.partnerId)
		if (logoUrl) { await deleteFromBlob(currentPartner.logo || currentPartner.avatar); update.logo = logoUrl; update.avatar = logoUrl }
		else if (req.body.logo === null || req.body.avatar === null) { await deleteFromBlob(currentPartner.logo || currentPartner.avatar); update.logo = null; update.avatar = null }
		const partner = await PartnerModel.findByIdAndUpdate(req.partnerId, update, { new: true, runValidators: true }).populate(partnerPopulate)
		if (!partner) return res.status(404).json({ message: "Партнерский профиль не найден" })
		return res.json({ message: "Партнерский профиль обновлен", data: formatPartner(partner) })
	} catch (error) {
		console.error("Update partner profile error:", error)
		if (error.code === 11000) return res.status(409).json({ message: buildDuplicateMessage(error) })
		return res.status(500).json({ message: error.message || "Не удалось обновить партнерский профиль" })
	}
}
