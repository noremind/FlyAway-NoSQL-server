import express from "express"
import { patchUpdateUser } from "../../../../controllers/users/id/update/patch.js"
import { requireAuth, requireSelfOrRoles } from "../../../../middleware/checkAuth.js"

const router = express.Router({ mergeParams: true })

router.patch("/", requireAuth, requireSelfOrRoles("admin"), patchUpdateUser)

export default router
