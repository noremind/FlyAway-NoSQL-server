import express from "express"

import authRoutes from "./auth/index.js"
import userRoutes from "./users/index.js"
import { hotelRoutes } from "./hotels.js"
import { partnerRoutes } from './partners.js'
import { adRoutes } from "./ad.js";
import { bannerRoutes } from "./banner.js";
import { tourRoutes } from "./tours.js"
import { devRoutes } from "./dev.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/banners", bannerRoutes)
router.use("/ads", adRoutes)
router.use("/tours", tourRoutes)
router.use("/users", userRoutes)
router.use("/hotels", hotelRoutes)
router.use("/partners", partnerRoutes)
router.use("/dev", devRoutes)

export default router
