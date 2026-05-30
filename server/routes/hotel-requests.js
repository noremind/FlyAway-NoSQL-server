import express from "express"
import {
	createHotelRequest,
	getManagedHotelRequestGroup,
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

hotelRequestRoutes.get(
	"/manage/:hotelId",
	requireAuth,
	requireRoles("admin", "partner"),
	getManagedHotelRequestGroup
)

hotelRequestRoutes.patch(
	"/:id/status",
	requireAuth,
	requireRoles("admin", "partner"),
	updateHotelRequestStatus
)
