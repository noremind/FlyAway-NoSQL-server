import mongoose from "mongoose"
import ContentViewModel from "../models/ContentView.js"
import TourModel from "../models/Tour.js"
import HotelModel from "../models/Hotel.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const getContentModel = (contentType) => contentType === "hotel" ? HotelModel : TourModel

export const recordContentView = async (req, res) => {
	try {
		const contentType = normalizeString(req.body.contentType)
		const contentId = normalizeString(req.body.contentId)

		if (!["tour", "hotel"].includes(contentType) || !mongoose.Types.ObjectId.isValid(contentId)) {
			return res.status(400).json({ message: "Некорректный объект аналитики" })
		}

		const content = await getContentModel(contentType).findById(contentId).select("partner")

		if (!content) {
			return res.status(404).json({ message: "Объект не найден" })
		}

		await ContentViewModel.create({
			contentType,
			content: content._id,
			partner: content.partner || null,
			user: req.userId || null,
		})

		return res.status(201).json({ data: { tracked: true } })
	} catch (error) {
		console.error("Record content view error:", error)
		return res.status(500).json({ message: "Не удалось сохранить просмотр" })
	}
}
