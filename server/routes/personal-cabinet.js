import express from "express"
import {
	getFavouriteTours,
	getTourBookings,
	getWallet,
	toggleFavouriteTour,
} from "../controllers/personalCabinetController.js"
import { cancelOwnTourBooking } from "../controllers/tourBookingController.js"
import { requireAuth } from "../middleware/checkAuth.js"

export const personalCabinetRoutes = express.Router()

personalCabinetRoutes.get("/wallet", requireAuth, getWallet)
personalCabinetRoutes.get("/favourites/tours", requireAuth, getFavouriteTours)
personalCabinetRoutes.post(
	"/favourites/tours/:tourId/toggle",
	requireAuth,
	toggleFavouriteTour
)
personalCabinetRoutes.get("/bookings/tours", requireAuth, getTourBookings)
personalCabinetRoutes.patch(
	"/bookings/tours/:bookingId/cancel",
	requireAuth,
	cancelOwnTourBooking
)