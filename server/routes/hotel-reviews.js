import express from "express"
import {
	createHotelReview,
	getCanReviewHotel,
	getHotelReviewsByHotel,
} from "../controllers/hotelReviewController.js"
import { requireAuth } from "../middleware/checkAuth.js"

export const hotelReviewRoutes = express.Router()

hotelReviewRoutes.get("/hotel/:hotelId", getHotelReviewsByHotel)
hotelReviewRoutes.get("/can-review/:hotelId", requireAuth, getCanReviewHotel)
hotelReviewRoutes.post("/", requireAuth, createHotelReview)
