import express from "express"
import { getDashboardSummary } from "../controllers/dashboardController.js"
import { requireAuth, requireRoles } from "../middleware/checkAuth.js"

export const dashboardRoutes = express.Router()

dashboardRoutes.get(
	"/summary",
	requireAuth,
	requireRoles("admin", "partner"),
	getDashboardSummary
)