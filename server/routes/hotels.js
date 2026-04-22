import express from "express"
import {
	getHotels,
	getManagedHotels,
	createHotel,
	getOneHotel,
	updateHotel,
	deleteHotel,
} from "../controllers/hotelController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const hotelRoutes = express.Router()

hotelRoutes.get(
	"/manage",
	requireAuth,
	requireRoles("admin", "partner"),
	getManagedHotels
)
hotelRoutes.get("/", getHotels)
hotelRoutes.get("/:id", getOneHotel)
hotelRoutes.post(
	"/create",
	requireAuth,
	requireRoles("admin", "partner"),
	createHotel
)
hotelRoutes.patch(
	"/:id",
	requireAuth,
	requireRoles("admin", "partner"),
	updateHotel
)
hotelRoutes.delete(
	"/:id",
	requireAuth,
	requireRoles("admin", "partner"),
	deleteHotel
)
