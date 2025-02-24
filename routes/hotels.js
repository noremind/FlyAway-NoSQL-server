import express from "express"
import { getHotels } from "../controllers/hotelController.js"

export const hotelRoutes = express.Router()

hotelRoutes.get("/", getHotels)
