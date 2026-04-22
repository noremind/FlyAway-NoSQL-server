import express from "express"
import {
	getManagedTourBookings,
	updateManagedTourBookingStatus,
} from "../controllers/tourBookingController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const tourBookingRoutes = express.Router()

tourBookingRoutes.get(
	"/manage",
	requireAuth,
	requireRoles("admin", "partner"),
	getManagedTourBookings
)

tourBookingRoutes.patch(
	"/:bookingId/status",
	requireAuth,
	requireRoles("admin", "partner"),
	updateManagedTourBookingStatus
)