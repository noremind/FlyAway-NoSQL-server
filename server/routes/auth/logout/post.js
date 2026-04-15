import express from "express"
import { postLogout } from "../../../controllers/auth/logout/post.js"
import { requireAuth } from "../../../middleware/checkAuth.js"

const router = express.Router()

router.post("/", requireAuth, postLogout)

export default router
