import express from "express"
import {
	createBanner,
	deleteBanner,
	getBanner,
} from "../controllers/bannerController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const bannerRoutes = express.Router()

bannerRoutes.get("/", getBanner)
bannerRoutes.post("/create", requireAuth, requireRoles("admin"), createBanner)
bannerRoutes.delete("/:id", requireAuth, requireRoles("admin"), deleteBanner)


