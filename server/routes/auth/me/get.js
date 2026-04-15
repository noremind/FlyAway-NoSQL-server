import express from "express"
import { getMe } from "../../../controllers/auth/me/get.js"
import { requireAuth } from "../../../middleware/checkAuth.js"

const router = express.Router()

router.get("/", requireAuth, getMe)

export default router
