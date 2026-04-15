import express from "express"

import { userRoutes } from "./users.js"
import { hotelRoutes } from "./hotels.js"
import { partnerRoutes } from './partners.js'
import adRoutes from "./ad.js"; 
import { bannerRoutes } from "./banner.js";
<<<<<<< HEAD
=======
import { tourRoutes } from "./tours.js"
import { devRoutes } from "./dev.js"
>>>>>>> b355d69 (logo renewed)

const router = express.Router()

router.use("/banners", bannerRoutes);
router.use("/ads", adRoutes);
router.use("/users", userRoutes)
router.use("/hotels", hotelRoutes)
router.use("/partners", partnerRoutes)
router.use("/dev", devRoutes)

export default router
