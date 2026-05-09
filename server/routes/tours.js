import express from "express"
import {
	createTour,
	bookTourDate,
	getManagedTours,
	getOneTour,
	getTours,
	updateTour,
} from "../controllers/tourController.js"
import {
	getTourFilterCities,
	getTourFilterDurations,
} from "../controllers/tourFilterController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const tourRoutes = express.Router()

tourRoutes.get(
	"/manage",
	requireAuth,
	requireRoles("admin", "partner"),
	getManagedTours
)
tourRoutes.get("/filter/cities", getTourFilterCities)
tourRoutes.get("/filter/durations", getTourFilterDurations)
tourRoutes.get("/", getTours)
tourRoutes.post(
	"/create",
	requireAuth,
	requireRoles("admin", "partner"),
	createTour
)
tourRoutes.patch(
	"/:id",
	requireAuth,
	requireRoles("admin", "partner"),
	updateTour
)
tourRoutes.post("/:id/book-date", requireAuth, bookTourDate)
tourRoutes.get("/:id", getOneTour)
