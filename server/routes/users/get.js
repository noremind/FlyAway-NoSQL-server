import express from "express"
import { getUsers } from "../../controllers/users/get.js"
import { requireAuth, requireRoles } from "../../middleware/checkAuth.js"

const router = express.Router()

router.get("/", requireAuth, requireRoles("admin"), getUsers)

export default router
