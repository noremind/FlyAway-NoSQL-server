import BannerModel from "../models/Banner.js"
import { deleteFromBlob } from "../utils/uploadToBlob.js"

export const getBanner = async (req, res) => {
	try {
		const banner = await BannerModel.find().sort({ createdAt: -1 })
		res.json({ data: banner })
	} catch (error) {
		console.error("Banner fetch error:", error)
		res.status(500).json({
			message: "Ошибка при получении плакатов",
		})
	}
}

export const createBanner = async (req, res) => {
	try {
		const doc = new BannerModel({
			title: req.body.title,
			description: req.body.description,
			image: req.body.image,
			link: req.body.link,
			buttonText: req.body.buttonText,
		})

		const banner = await doc.save()
		res.status(201).json({ data: banner })
	} catch (error) {
		console.error("Banner create error:", error)
		res.status(500).json({
			message: "Ошибка при создании плаката",
		})
	}
}

export const deleteBanner = async (req, res) => {
	try {
		const banner = await BannerModel.findById(req.params.id)

		if (!banner) {
			return res.status(404).json({ message: "Плакат не найден" })
		}

		await deleteFromBlob(banner.image)
		await BannerModel.findByIdAndDelete(req.params.id)

		return res.json({ message: "Плакат удален" })
	} catch (error) {
		console.error("Banner delete error:", error)
		return res.status(500).json({
			message: "Ошибка при удалении плаката",
		})
	}
}
