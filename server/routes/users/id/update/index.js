import express from "express"
import patchRoute from "./patch.js"

const router = express.Router({ mergeParams: true })

router.use("/", patchRoute)

export default router
