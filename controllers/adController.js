import AdModel from "../models/ad.js"


export const getAds = async (req, res) => {
    try {
        const ad = await AdModel.find()
        res.json({ data: ad })
    } catch (error) {
        console.error("❌ Ошибка получения рекламы:", error)
        res.status(500).json({
            message: "Ошибка при получении рекламы",
        })
    }
}

