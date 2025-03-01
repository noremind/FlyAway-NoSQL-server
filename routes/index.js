import express from "express"

import { userRoutes } from "./users.js"
import { hotelRoutes } from "./hotels.js"

const router = express.Router()

router.use("/users", userRoutes)
router.use("/hotels", hotelRoutes)
console.log("beka")
export default router
