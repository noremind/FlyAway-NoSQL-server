import BannerModel from "../models/Banner.js"


export const getBanner = async (req, res) => {
    try {
        const banner = await BannerModel.find()
        res.json({ data: banner })
    } catch (error) {
        console.error("❌ Ошибка получения рекламы:", error)
        res.status(500).json({
            message: "Ошибка при получении рекламы",
        })
    }
}

export const createBanner = async (req, res) => {
	try {
		const doc = new BannerModel({
			title: req.body.title,
			image: req.body.image,
			tour: req.body.tour,
        })

		const banner = await doc.save()
		res.json({ data: banner })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: "Ошибка при создании banner",
		})
	}
}