import express from "express"
import {
	cancelOwnHotelRequest,
	getFavouriteHotels,
	getFavouriteTours,
	getHotelRequests,
	getTourBookings,
	getWallet,
	toggleFavouriteHotel,
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
personalCabinetRoutes.get("/favourites/hotels", requireAuth, getFavouriteHotels)
personalCabinetRoutes.post(
	"/favourites/hotels/:hotelId/toggle",
	requireAuth,
	toggleFavouriteHotel
)
personalCabinetRoutes.get("/bookings/tours", requireAuth, getTourBookings)
personalCabinetRoutes.patch(
	"/bookings/tours/:bookingId/cancel",
	requireAuth,
	cancelOwnTourBooking
)
personalCabinetRoutes.get("/bookings/hotels", requireAuth, getHotelRequests)
personalCabinetRoutes.patch(
	"/bookings/hotels/:bookingId/cancel",
	requireAuth,
	cancelOwnHotelRequest
)
