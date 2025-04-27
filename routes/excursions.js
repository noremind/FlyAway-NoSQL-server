import express from "express"
import {
	getExcursions,
	createExcursion,
	getOneExcursion,
	getOneExcursionItem,
} from "../controllers/excursionController.js"
export const excursionRoutes = express.Router()

excursionRoutes.get("/", getExcursions)
excursionRoutes.get("/:excursionId", getOneExcursion)
excursionRoutes.get("/:excursionId/item/:itemId", getOneExcursionItem)
excursionRoutes.post("/create", createExcursion)
