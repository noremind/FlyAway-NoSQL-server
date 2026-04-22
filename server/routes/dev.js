import express from "express"
import {
	seedDemoContent,
	testUploadToBlob,
} from "../controllers/devController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const devRoutes = express.Router()

devRoutes.post(
	"/blob-upload-test",
	requireAuth,
	requireRoles("admin"),
	testUploadToBlob
)

devRoutes.post(
	"/seed-demo-content",
	requireAuth,
	requireRoles("admin"),
	seedDemoContent
)