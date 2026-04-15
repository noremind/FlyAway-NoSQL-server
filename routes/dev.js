import express from "express"
import { testUploadToBlob } from "../controllers/devController.js"

export const devRoutes = express.Router()

devRoutes.post("/blob-upload-test", testUploadToBlob)
