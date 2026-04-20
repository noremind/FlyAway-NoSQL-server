import express from "express"

import authRoutes from "./auth/index.js"
import userRoutes from "./users/index.js"
import { hotelRoutes } from "./hotels.js"
import { partnerRoutes } from './partners.js'
import adRoutes from "./ad.js";
import { bannerRoutes } from "./banner.js";
import { promoCodeRoutes } from "./promocodes.js"
import { storageRoutes } from "./storage.js"
import { tourRoutes } from "./tours.js"
import { devRoutes } from "./dev.js"
import { personalCabinetRoutes } from "./personal-cabinet.js"

const router = express.Router()

router.get("/health", (req, res) => {
	res.json({ status: "ok" })
})
router.use("/auth", authRoutes)
router.use("/banners", bannerRoutes)
router.use("/ads", adRoutes)
router.use("/storage", storageRoutes)
router.use("/tours", tourRoutes)
router.use("/users", userRoutes)
router.use("/hotels", hotelRoutes)
router.use("/partners", partnerRoutes)
router.use("/personal-cabinet", personalCabinetRoutes)
router.use("/promocodes", promoCodeRoutes)
router.use("/dev", devRoutes)

export default router
