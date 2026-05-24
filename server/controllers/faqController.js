import FaqModel from "../models/Faq.js"

const normalizeString = (value) => value === null || value === undefined ? "" : String(value).trim()

const buildPayload = (body = {}) => ({
	question: normalizeString(body.question),
	answer: normalizeString(body.answer),
	category: normalizeString(body.category) || "Общее",
	order: Number(body.order) || 0,
	isActive: body.isActive === undefined ? true : Boolean(body.isActive),
})

export const getFaqItems = async (req, res) => {
	try {
		const includeInactive = req.userRole === "admin" && String(req.query.all || "") === "true"
		const filter = includeInactive ? {} : { isActive: true }
		const items = await FaqModel.find(filter).sort({ order: 1, createdAt: -1 })
		return res.json({ data: items })
	} catch (error) {
		console.error("Get FAQ error:", error)
		return res.status(500).json({ message: "Failed to get FAQ" })
	}
}

export const createFaqItem = async (req, res) => {
	try {
		const payload = buildPayload(req.body)
		if (!payload.question || !payload.answer) {
			return res.status(400).json({ message: "Question and answer are required" })
		}
		const item = await FaqModel.create(payload)
		return res.status(201).json({ data: item })
	} catch (error) {
		console.error("Create FAQ error:", error)
		return res.status(500).json({ message: "Failed to create FAQ" })
	}
}

export const updateFaqItem = async (req, res) => {
	try {
		const payload = buildPayload(req.body)
		if (!payload.question || !payload.answer) {
			return res.status(400).json({ message: "Question and answer are required" })
		}
		const item = await FaqModel.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
		if (!item) return res.status(404).json({ message: "FAQ item was not found" })
		return res.json({ data: item })
	} catch (error) {
		console.error("Update FAQ error:", error)
		return res.status(500).json({ message: "Failed to update FAQ" })
	}
}

export const deleteFaqItem = async (req, res) => {
	try {
		const item = await FaqModel.findByIdAndDelete(req.params.id)
		if (!item) return res.status(404).json({ message: "FAQ item was not found" })
		return res.json({ message: "FAQ item deleted" })
	} catch (error) {
		console.error("Delete FAQ error:", error)
		return res.status(500).json({ message: "Failed to delete FAQ" })
	}
}
