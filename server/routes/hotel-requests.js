import express from "express"
import {
	createHotelRequest,
	getManagedHotelRequests,
	updateHotelRequestStatus,
} from "../controllers/hotelRequestController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const hotelRequestRoutes = express.Router()

hotelRequestRoutes.post("/", createHotelRequest)

hotelRequestRoutes.get(
	"/manage",
	requireAuth,
	requireRoles("admin", "partner"),
	getManagedHotelRequests
)

hotelRequestRoutes.patch(
	"/:id/status",
	requireAuth,
	requireRoles("admin", "partner"),
	updateHotelRequestStatus
)