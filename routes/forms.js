import express from "express"
import { submitForm } from "../controllers/formController.js"

export const formRoutes = express.Router()

formRoutes.post("/", submitForm)
