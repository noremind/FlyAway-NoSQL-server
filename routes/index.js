import express from "express"

import { userRoutes } from "./users.js"
// import { hotelRoutes } from "./hotels.js"
import { rentRoutes } from "./rents.js"
import { carRoutes } from "./cars.js"
import { yachtRoutes } from "./yachts.js"

const router = express.Router()

router.use("/users", userRoutes)
// router.use("/hotels", hotelRoutes)
router.use("/rents", rentRoutes)
router.use("/cars", carRoutes)
router.use("/yachts", yachtRoutes)
export default router
