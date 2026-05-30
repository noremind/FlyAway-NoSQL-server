import mongoose from "mongoose"
import ContentViewModel from "../models/ContentView.js"
import TourModel from "../models/Tour.js"
import HotelModel from "../models/Hotel.js"

const normalizeId = (value) => String(value || "").trim()

const buildViewMiddleware = (contentType, model) => async (req, res, next) => {
	try {
		const contentId = normalizeId(req.params.id)

		if (mongoose.Types.ObjectId.isValid(contentId)) {
			const content = await model.findById(contentId).select("partner")

			if (content) {
				await ContentViewModel.create({
					contentType,
					content: content._id,
					partner: content.partner || null,
					user: req.userId || null,
				})
			}
		}
	} catch (error) {
		console.error("Track content view error:", error?.message || error)
	}

	return next()
}

export const recordTourView = buildViewMiddleware("tour", TourModel)
export const recordHotelView = buildViewMiddleware("hotel", HotelModel)
