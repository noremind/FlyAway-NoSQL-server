import express from "express"
import postRoute from "./post.js"

const router = express.Router()

router.use("/", postRoute)

export default router
