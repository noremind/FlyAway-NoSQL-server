import express from "express"
import { createAd, deleteAd, getAds } from "../controllers/adController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

const adRoutes = express.Router()

adRoutes.get("/", getAds)
adRoutes.post("/create", requireAuth, requireRoles("admin"), createAd)
adRoutes.delete("/:id", requireAuth, requireRoles("admin"), deleteAd)

export default adRoutes
