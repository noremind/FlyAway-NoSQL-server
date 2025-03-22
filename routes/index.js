import express from "express"

import { userRoutes } from "./users.js"
import { hotelRoutes } from "./hotels.js"
import { partnerRoutes } from "./partners.js"
import { adRoutes } from "./ad.js"
import { tourRoutes } from "./tours.js"

const router = express.Router()

router.use("/ads", adRoutes)
router.use("/tours", tourRoutes)
router.use("/users", userRoutes)
router.use("/hotels", hotelRoutes)
router.use("/partners", partnerRoutes)

export default router
