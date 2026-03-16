import express from "express"
import {
	getTours,
	getOneTour,
	createTour,
} from "../controllers/tourController.js"

export const tourRoutes = express.Router()

tourRoutes.get("/", getTours)
tourRoutes.post("/create", createTour)
tourRoutes.get("/:id", getOneTour)
