import express from "express"
import { seedDemoContent, testUploadToBlob } from "../controllers/devController.js"

export const devRoutes = express.Router()

devRoutes.post("/blob-upload-test", testUploadToBlob)
devRoutes.post("/seed-demo-content", seedDemoContent)
