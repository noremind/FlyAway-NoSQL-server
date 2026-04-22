import TourModel from "../models/Tour.js"
import TourReviewModel from "../models/TourReview.js"
import UserModel from "../models/User.js"

const normalizeString = (value) => {
	if (value === null || value === undefined) return ""
	return String(value).trim()
}

const parseBookingDate = (value) => {
	const text = normalizeString(value)

	if (!text) {
		return null
	}

	const parsed = /^\d{4}-\d{2}-\d{2}$/.test(text)
		? new Date(`${text}T00:00:00`)
		: new Date(text)

	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const deriveBookingStatus = (booking) => {
	const currentStatus = normalizeString(booking?.status) || "active"

	if (currentStatus !== "active") {
		return currentStatus
	}

	const parsedDate = parseBookingDate(booking?.date)

	if (!parsedDate) {
		return currentStatus
	}

	return parsedDate.getTime() < Date.now() - 24 * 60 * 60 * 1000
		? "completed"
		: currentStatus
}

const canUserReviewTour = (user, tourId) => {
	const bookings = Array.isArray(user?.tourBookings) ? user.tourBookings : []

	return bookings.some((booking) => {
		return (
			String(booking?.tour) === String(tourId) &&
			deriveBookingStatus(booking) === "completed"
		)
	})
}

const updateTourReviewSummary = async (tourId) => {
	const summary = await TourReviewModel.aggregate([
		{
			$match: {
				tour: TourModel.db.base.Types.ObjectId.createFromHexString(String(tourId)),
			},
		},
		{
			$group: {
				_id: "$tour",
				avgRating: { $avg: "$rating" },
				reviewsCount: { $sum: 1 },
			},
		},
	])

	const nextRating = Number(summary?.[0]?.avgRating || 0)
	const nextReviewsCount = Number(summary?.[0]?.reviewsCount || 0)

	await TourModel.findByIdAndUpdate(tourId, {
		rating: Number(nextRating.toFixed(1)),
		reviewsCount: nextReviewsCount,
	})
}

export const getLatestTourReviews = async (req, res) => {
	try {
		const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 6))

		const reviews = await TourReviewModel.find()
			.sort({ createdAt: -1 })
			.limit(limit)
			.populate({ path: "createdBy", select: "name avatar" })
			.populate({
				path: "tour",
				select: "title avatar rating reviewsCount partner",
				populate: { path: "partner", select: "title logo avatar" },
			})

		return res.json({ data: reviews })
	} catch (error) {
		console.error("Get latest tour reviews error:", error)
		return res.status(500).json({ message: "Failed to get latest reviews" })
	}
}

export const getTourReviewsByTour = async (req, res) => {
	try {
		const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20))
		const tourId = req.params.tourId

		const reviews = await TourReviewModel.find({ tour: tourId })
			.sort({ createdAt: -1 })
			.limit(limit)
			.populate({ path: "createdBy", select: "name avatar" })
			.populate({
				path: "tour",
				select: "title avatar rating reviewsCount partner",
				populate: { path: "partner", select: "title logo avatar" },
			})

		return res.json({ data: reviews })
	} catch (error) {
		console.error("Get tour reviews error:", error)
		return res.status(500).json({ message: "Failed to get tour reviews" })
	}
}

export const getCanReviewTour = async (req, res) => {
	try {
		const tourId = req.params.tourId

		const user = await UserModel.findById(req.userId).select("tourBookings")
		if (!user) {
			return res.status(404).json({ message: "User was not found" })
		}

		const existingReview = await TourReviewModel.findOne({
			tour: tourId,
			createdBy: req.userId,
		}).select("_id")

		const canReview =
			!existingReview &&
			canUserReviewTour(user, tourId)

		return res.json({
			data: {
				canReview,
				hasReview: Boolean(existingReview),
			},
		})
	} catch (error) {
		console.error("Get can review tour error:", error)
		return res.status(500).json({ message: "Failed to check review access" })
	}
}

export const createTourReview = async (req, res) => {
	try {
		const tourId = normalizeString(req.body.tourId || req.body.tour)
		const rating = Number(req.body.rating)
		const comment = normalizeString(req.body.comment)

		if (!tourId) {
			return res.status(400).json({ message: "Tour is required" })
		}

		if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
			return res.status(400).json({ message: "Rating must be from 1 to 5" })
		}

		if (comment.length < 10) {
			return res
				.status(400)
				.json({ message: "Comment must contain at least 10 characters" })
		}

		const [tour, user, existingReview] = await Promise.all([
			TourModel.findById(tourId).select("_id title"),
			UserModel.findById(req.userId).select("name avatar tourBookings"),
			TourReviewModel.findOne({
				tour: tourId,
				createdBy: req.userId,
			}).select("_id"),
		])

		if (!tour) {
			return res.status(404).json({ message: "Tour was not found" })
		}

		if (!user) {
			return res.status(404).json({ message: "User was not found" })
		}

		if (existingReview) {
			return res
				.status(409)
				.json({ message: "You have already left a review for this tour" })
		}

		if (!canUserReviewTour(user, tourId)) {
			return res.status(403).json({
				message: "Only users with completed tour can leave a review",
			})
		}

		const review = await TourReviewModel.create({
			tour: tourId,
			createdBy: req.userId,
			rating,
			comment,
		})

		await updateTourReviewSummary(tourId)

		const populatedReview = await TourReviewModel.findById(review._id)
			.populate({ path: "createdBy", select: "name avatar" })
			.populate({
				path: "tour",
				select: "title avatar rating reviewsCount partner",
				populate: { path: "partner", select: "title logo avatar" },
			})

		return res.status(201).json({
			message: "Review created",
			data: populatedReview,
		})
	} catch (error) {
		console.error("Create tour review error:", error)

		if (error?.code === 11000) {
			return res
				.status(409)
				.json({ message: "You have already left a review for this tour" })
		}

		return res.status(500).json({ message: "Failed to create review" })
	}
}