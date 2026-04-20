import express from "express"
import {
	createPromoCode,
	getPromoCodes,
	previewPromoCode,
} from "../controllers/promoCodeController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const promoCodeRoutes = express.Router()

promoCodeRoutes.post("/preview", previewPromoCode)
promoCodeRoutes.get(
	"/",
	requireAuth,
	requireRoles("admin", "partner"),
	getPromoCodes
)
promoCodeRoutes.post(
	"/",
	requireAuth,
	requireRoles("admin", "partner"),
	createPromoCode
)
