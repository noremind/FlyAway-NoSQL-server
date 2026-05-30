import mongoose from "mongoose"
import HotelModel from "../models/Hotel.js"
import HotelRequestModel from "../models/HotelRequest.js"
import HotelReviewModel from "../models/HotelReview.js"
import UserModel from "../models/User.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const parseBookingDate = (value) => {
	const text = normalizeString(value)
	if (!text) return null

	const parsed = /^\d{4}-\d{2}-\d{2}$/.test(text)
		? new Date(`${text}T00:00:00`)
		: new Date(text)

	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const normalizeHotelStatus = (status) => {
	const normalized = normalizeString(status)
	if (normalized === "in_progress" || normalized === "contacted") return "active"
	if (normalized === "closed") return "completed"
	if (["new", "active", "completed", "cancelled"].includes(normalized)) return normalized
	return "new"
}

const deriveHotelBookingStatus = (booking) => {
	const status = normalizeHotelStatus(booking?.status)
	if (status !== "active") return status

	const checkOutDate = parseBookingDate(booking?.checkOut)
	if (checkOutDate && checkOutDate.getTime() < Date.now()) return "completed"

	return "active"
}

const canUserReviewHotel = async (userId, hotelId) => {
	const booking = await HotelRequestModel.findOne({
		createdBy: userId,
		hotel: hotelId,
		status: { $in: ["active", "completed", "closed", "in_progress", "contacted"] },
	}).sort({ createdAt: -1 })

	return Boolean(booking && deriveHotelBookingStatus(booking) === "completed")
}

const updateHotelReviewSummary = async (hotelId) => {
	const hotelObjectId = new mongoose.Types.ObjectId(String(hotelId))
	const summary = await HotelReviewModel.aggregate([
		{
			$match: {
				hotel: hotelObjectId,
			},
		},
		{
			$group: {
				_id: "$hotel",
				avgRating: { $avg: "$rating" },
				reviewsCount: { $sum: 1 },
			},
		},
	])

	const nextRating = Number(summary?.[0]?.avgRating || 0)
	const nextReviewsCount = Number(summary?.[0]?.reviewsCount || 0)

	await HotelModel.findByIdAndUpdate(hotelId, {
		rating: Number(nextRating.toFixed(1)),
		reviewsCount: nextReviewsCount,
	})
}

export const getHotelReviewsByHotel = async (req, res) => {
	try {
		const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20))
		const hotelId = normalizeString(req.params.hotelId)

		const reviews = await HotelReviewModel.find({ hotel: hotelId })
			.sort({ createdAt: -1 })
			.limit(limit)
			.populate({ path: "createdBy", select: "name avatar" })
			.populate({ path: "hotel", select: "name images rating reviewsCount partner" })

		return res.json({ data: reviews })
	} catch (error) {
		console.error("Get hotel reviews error:", error)
		return res.status(500).json({ message: "Failed to get hotel reviews" })
	}
}

export const getCanReviewHotel = async (req, res) => {
	try {
		const hotelId = normalizeString(req.params.hotelId)

		const [user, existingReview] = await Promise.all([
			UserModel.findById(req.userId).select("_id"),
			HotelReviewModel.findOne({ hotel: hotelId, createdBy: req.userId }).select("_id"),
		])

		if (!user) return res.status(404).json({ message: "User was not found" })

		const canReview = !existingReview && await canUserReviewHotel(req.userId, hotelId)

		return res.json({
			data: {
				canReview,
				hasReview: Boolean(existingReview),
			},
		})
	} catch (error) {
		console.error("Get can review hotel error:", error)
		return res.status(500).json({ message: "Failed to check review access" })
	}
}

export const createHotelReview = async (req, res) => {
	try {
		const hotelId = normalizeString(req.body.hotelId || req.body.hotel)
		const rating = Number(req.body.rating)
		const comment = normalizeString(req.body.comment)

		if (!hotelId) return res.status(400).json({ message: "Hotel is required" })
		if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
			return res.status(400).json({ message: "Rating must be from 1 to 5" })
		}
		if (comment.length < 10) {
			return res.status(400).json({ message: "Comment must contain at least 10 characters" })
		}

		const [hotel, user, existingReview] = await Promise.all([
			HotelModel.findById(hotelId).select("_id name"),
			UserModel.findById(req.userId).select("name avatar"),
			HotelReviewModel.findOne({ hotel: hotelId, createdBy: req.userId }).select("_id"),
		])

		if (!hotel) return res.status(404).json({ message: "Hotel was not found" })
		if (!user) return res.status(404).json({ message: "User was not found" })
		if (existingReview) {
			return res.status(409).json({ message: "You have already left a review for this hotel" })
		}

		const canReview = await canUserReviewHotel(req.userId, hotelId)
		if (!canReview) {
			return res.status(403).json({ message: "Only users with completed hotel booking can leave a review" })
		}

		const review = await HotelReviewModel.create({
			hotel: hotelId,
			createdBy: req.userId,
			rating,
			comment,
		})

		await updateHotelReviewSummary(hotelId)

		const populatedReview = await HotelReviewModel.findById(review._id)
			.populate({ path: "createdBy", select: "name avatar" })
			.populate({ path: "hotel", select: "name images rating reviewsCount partner" })

		return res.status(201).json({ message: "Review created", data: populatedReview })
	} catch (error) {
		console.error("Create hotel review error:", error)

		if (error?.code === 11000) {
			return res.status(409).json({ message: "You have already left a review for this hotel" })
		}

		return res.status(500).json({ message: "Failed to create hotel review" })
	}
}
