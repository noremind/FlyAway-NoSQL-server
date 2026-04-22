import express from "express"
import {
	getPartners,
	createPartner,
	getOnePartner,
	applyPartner,
	getCurrentPartner,
	updateCurrentPartner,
} from "../controllers/partnerController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const partnerRoutes = express.Router()

partnerRoutes.get("/", getPartners)
partnerRoutes.post("/create", requireAuth, requireRoles("admin"), createPartner)
partnerRoutes.post("/apply", requireAuth, applyPartner)
partnerRoutes.get("/me", requireAuth, requireRoles("partner"), getCurrentPartner)
partnerRoutes.patch(
	"/me",
	requireAuth,
	requireRoles("partner"),
	updateCurrentPartner
)
partnerRoutes.get("/:id", getOnePartner)