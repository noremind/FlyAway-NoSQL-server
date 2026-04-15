import express from "express"
import { postPartnerLogin } from "../../../controllers/auth/partner-login/post.js"

const router = express.Router()

router.post("/", postPartnerLogin)

export default router
