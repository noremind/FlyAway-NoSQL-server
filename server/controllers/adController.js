import AdModel from "../models/Ad.js"
import { deleteFromBlob } from "../utils/uploadToBlob.js"

export const getAds = async (req, res) => {
	try {
		const ad = await AdModel.find().sort({ createdAt: -1 })
		res.json({ data: ad })
	} catch (error) {
		console.error("Ads fetch error:", error)
		res.status(500).json({
			message: "Ошибка при получении рекламы",
		})
	}
}

export const createAd = async (req, res) => {
	try {
		const ad = await AdModel.create({
			title: req.body.title,
			image: req.body.image,
			link: req.body.link,
			type: req.body.type,
		})

		return res.status(201).json({ data: ad })
	} catch (error) {
		console.error("Ad create error:", error)
		return res.status(500).json({
			message: "Ошибка при создании баннера",
		})
	}
}

export const deleteAd = async (req, res) => {
	try {
		const ad = await AdModel.findById(req.params.id)

		if (!ad) {
			return res.status(404).json({ message: "Баннер не найден" })
		}

		await deleteFromBlob(ad.image)
		await AdModel.findByIdAndDelete(req.params.id)

		return res.json({ message: "Баннер удален" })
	} catch (error) {
		console.error("Ad delete error:", error)
		return res.status(500).json({
			message: "Ошибка при удалении баннера",
		})
	}
}
