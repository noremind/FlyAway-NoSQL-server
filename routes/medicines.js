import express from "express"
import { getMedicine, createMedicine } from "../controllers/medicineController.js"
export const medicineRoutes = express.Router()

medicineRoutes.get("/", getMedicine)
medicineRoutes.post("/create", createMedicine)
