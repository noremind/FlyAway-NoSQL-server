import express from "express"
import { postRegister } from "../../../controllers/auth/register/post.js"

const router = express.Router()

router.post("/", postRegister)

export default router
