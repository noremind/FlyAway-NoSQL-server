import express from "express"
import { getHotels, createHotel } from "../controllers/hotelController.js"

export const hotelRoutes = express.Router()

hotelRoutes.get("/", getHotels)
hotelRoutes.post("/create", createHotel)
