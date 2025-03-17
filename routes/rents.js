import express from "express"
import {
	getRents,
	createRents,
	getOneRent,
} from "../controllers/rentController.js"

export const rentRoutes = express.Router()

rentRoutes.get("/", getRents)
rentRoutes.get("/:id", getOneRent)
rentRoutes.post("/create", createRents)
