import express from "express"
import {
	getHotels,
	createHotel,
	getOneHotel,
} from "../controllers/hotelController.js"

export const hotelRoutes = express.Router()

hotelRoutes.get("/", getHotels)
hotelRoutes.get("/:id", getOneHotel)
hotelRoutes.post("/create", createHotel)
