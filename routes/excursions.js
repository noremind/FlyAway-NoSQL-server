import express from "express"
import {
	getExcursions,
	createExcursion,
} from "../controllers/excursionController.js"
export const excursionRoutes = express.Router()

excursionRoutes.get("/", getExcursions)
excursionRoutes.post("/create", createExcursion)
