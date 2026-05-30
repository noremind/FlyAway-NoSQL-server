import express from "express"
import { verifyHotelQr, verifyTourQr } from "../controllers/qrController.js"

export const qrRoutes = express.Router()

qrRoutes.get("/tours/:hash", verifyTourQr)
qrRoutes.get("/hotels/:hash", verifyHotelQr)
