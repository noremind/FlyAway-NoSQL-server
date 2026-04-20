import express from "express"
import bonusRoutes from "./bonus/index.js"
import deleteRoute from "./delete.js"
import getRoute from "./get.js"
import updateRoutes from "./update/index.js"

const router = express.Router({ mergeParams: true })

router.use("/", getRoute)
router.use("/", deleteRoute)
router.use("/bonus", bonusRoutes)
router.use("/update", updateRoutes)
router.use("/", updateRoutes)

export default router
