import express from "express"
import {
	getYachts,
	createYacht,
	getOneYacht,
} from "../controllers/yachtController.js"

export const yachtRoutes = express.Router()

yachtRoutes.get("/", getYachts)
yachtRoutes.post("/create", createYacht)
yachtRoutes.get("/:id", getOneYacht)
