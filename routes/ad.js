import express from "express"
import { getAds } from "../controllers/adController.js"

export const adRoutes = express.Router()

adRoutes.get("/", getAds)
