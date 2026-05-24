import express from "express"
import {
	createFaqItem,
	deleteFaqItem,
	getFaqItems,
	updateFaqItem,
} from "../controllers/faqController.js"
import { requireAuth, requireRoles, optionalAuth } from "../middleware/checkAuth.js"

export const faqRoutes = express.Router()

faqRoutes.get("/", optionalAuth, getFaqItems)
faqRoutes.post("/", requireAuth, requireRoles("admin"), createFaqItem)
faqRoutes.patch("/:id", requireAuth, requireRoles("admin"), updateFaqItem)
faqRoutes.delete("/:id", requireAuth, requireRoles("admin"), deleteFaqItem)
