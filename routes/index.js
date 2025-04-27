import express from "express"

import { userRoutes } from "./users.js"
import { rentRoutes } from "./rents.js"
import { carRoutes } from "./cars.js"
import { yachtRoutes } from "./yachts.js"
import { formRoutes } from "./forms.js"
import { excursionRoutes } from "./excursions.js"
import { medicineRoutes } from "./medicines.js"

const router = express.Router()

router.use("/users", userRoutes)
router.use("/rents", rentRoutes)
router.use("/cars", carRoutes)
router.use("/yachts", yachtRoutes)
router.use("/form", formRoutes)
router.use("/excursions", excursionRoutes)
router.use("/medicines", medicineRoutes)
export default router
