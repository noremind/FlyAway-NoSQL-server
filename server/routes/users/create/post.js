import express from "express"
import { postCreateUser } from "../../../controllers/users/create/post.js"
import { requireAuth, requireRoles } from "../../../middleware/checkAuth.js"

const router = express.Router()

router.post("/", requireAuth, requireRoles("admin"), postCreateUser)

export default router
