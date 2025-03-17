import PartnerModel from "../models/Partner.js"

export const getPartners = async (req, res) => {
	try {
		const partner = await PartnerModel.find()

		res.json({ data: partner })
	} catch (error) {
		res.status(500).json({
			message: "Ошибка при получении партнеров",
		})
	}
}

export const createPartner = async (req, res) => {
	try {
		const doc = new PartnerModel({
			title: req.body.title,
			description: req.body.description,
			rating: req.body.rating,
			avatar: req.body.avatar,
			tours: req.body.tours,
			hotels: req.body.hotels,
		})

		const partner = await doc.save()
		res.json(partner)
	} catch (error) {
		res.status(500).json({
			message: "Ошибка при создании партнера",
		})
	}
}
