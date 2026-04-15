import express from "express"
import getRoute from "./get.js"
import createRoutes from "./create/index.js"
import idRoutes from "./id/index.js"
import { getMe } from "../../controllers/auth/me/get.js"
import { patchUpdateUser } from "../../controllers/users/id/update/patch.js"
import { requireAuth } from "../../middleware/checkAuth.js"

const router = express.Router()

router.use("/", getRoute)
router.use("/create", createRoutes)

router.get("/current-info", requireAuth, getMe)
router.put("/update", requireAuth, (req, res) => {
	req.params.id = req.userId
	return patchUpdateUser(req, res)
})

router.use("/:id", idRoutes)

export default router
