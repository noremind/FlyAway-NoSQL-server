import express from "express"
import { creditUserBonus } from "../../../../controllers/users/bonusController.js"
import { requireAuth, requireRoles } from "../../../../middleware/checkAuth.js"

const router = express.Router({ mergeParams: true })

router.patch("/", requireAuth, requireRoles("admin"), creditUserBonus)

export default router
