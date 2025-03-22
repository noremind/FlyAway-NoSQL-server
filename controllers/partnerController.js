import PartnerModel from "../models/Partner.js"

export const getPartners = async (req, res) => {
	try {
		const partners = await PartnerModel.find()

		const formattedPartners = partners.map((partner) => {
			const { createdAt, updatedAt, __v, ...partnerData } = partner.toObject()
			return { ...partnerData, tour_count: partner.tours.length }
		})

		res.json({
			data: formattedPartners,
		})
	} catch (error) {
		console.error("Ошибка при получении партнеров:", error)
		res.status(500).json({
			message: "Ошибка при получении партнеров",
		})
	}
}

export const getOnePartner = async (req, res) => {
	try {
		const partner = await PartnerModel.findById(req.params.id)

		if (!partner) {
			return res.status(404).json({
				message: "Партнер не найден",
			})
		}

		const { createdAt, updatedAt, __v, ...partnerData } = partner._doc

		res.json({
			data: { partnerData },
		})
	} catch (error) {
		console.error("Ошибка при получении партнеров:", error)
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
			contacts: req.body.contacts,
		})

		const partner = await doc.save()
		res.json(partner)
	} catch (error) {
		res.status(500).json({
			message: "Ошибка при создании партнера",
		})
	}
}
