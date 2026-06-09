import express from "express"
import { confirmTourQr, verifyHotelQr, verifyTourQr } from "../controllers/qrController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const qrRoutes = express.Router()

qrRoutes.get("/tours/:hash", requireAuth, verifyTourQr)
qrRoutes.patch("/tours/:hash/confirm", requireAuth, requireRoles("partner"), confirmTourQr)
qrRoutes.get("/hotels/:hash", verifyHotelQr)