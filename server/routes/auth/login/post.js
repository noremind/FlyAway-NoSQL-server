import express from "express"
import { postLogin } from "../../../controllers/auth/login/post.js"

const router = express.Router()

router.post("/", postLogin)

export default router
