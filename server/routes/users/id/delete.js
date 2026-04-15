import express from "express"
import { deleteUser } from "../../../controllers/users/id/delete.js"
import { requireAuth, requireRoles } from "../../../middleware/checkAuth.js"

const router = express.Router({ mergeParams: true })

router.delete("/", requireAuth, requireRoles("admin"), deleteUser)

export default router
