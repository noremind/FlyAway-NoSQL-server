import express from "express"
import { getPartners, createPartner } from "../controllers/partnerController.js"

export const partnerRoutes = express.Router()

partnerRoutes.get("/", getPartners)
partnerRoutes.post("/create", createPartner)
