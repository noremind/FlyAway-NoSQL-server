import express from "express"
import { getWallet } from "../controllers/personalCabinetController.js"
import { requireAuth } from "../middleware/checkAuth.js"

export const personalCabinetRoutes = express.Router()

personalCabinetRoutes.get("/wallet", requireAuth, getWallet)
