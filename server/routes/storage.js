import express from "express"
import {
	deleteStorageFile,
	uploadStorageFile,
} from "../controllers/storageController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const storageRoutes = express.Router()

storageRoutes.post(
	"/upload",
	requireAuth,
	requireRoles("admin", "partner"),
	uploadStorageFile
)
storageRoutes.post(
	"/delete",
	requireAuth,
	requireRoles("admin", "partner"),
	deleteStorageFile
)
