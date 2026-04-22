import express from "express"
import {
	createTourReview,
	getCanReviewTour,
	getLatestTourReviews,
	getTourReviewsByTour,
} from "../controllers/tourReviewController.js"
import { requireAuth } from "../middleware/checkAuth.js"

export const tourReviewRoutes = express.Router()

tourReviewRoutes.get("/latest", getLatestTourReviews)
tourReviewRoutes.get("/tour/:tourId", getTourReviewsByTour)
tourReviewRoutes.get("/can-review/:tourId", requireAuth, getCanReviewTour)
tourReviewRoutes.post("/", requireAuth, createTourReview)