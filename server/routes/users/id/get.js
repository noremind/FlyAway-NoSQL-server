import express from "express"
import { getUserById } from "../../../controllers/users/id/get.js"
import { requireAuth, requireSelfOrRoles } from "../../../middleware/checkAuth.js"

const router = express.Router({ mergeParams: true })

router.get("/", requireAuth, requireSelfOrRoles("admin"), getUserById)

export default router
