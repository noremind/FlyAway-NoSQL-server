import express from "express"
import {
	getPartners,
	createPartner,
	getOnePartner,
} from "../controllers/partnerController.js"

export const partnerRoutes = express.Router()

partnerRoutes.get("/", getPartners)
partnerRoutes.post("/create", createPartner)
partnerRoutes.get("/:id", getOnePartner)
