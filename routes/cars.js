import express from "express"
import { getCars, createCars, getOneCar } from "../controllers/carController.js"

export const carRoutes = express.Router()

carRoutes.get("/", getCars)
carRoutes.get("/:id", getOneCar)
carRoutes.post("/create", createCars)
