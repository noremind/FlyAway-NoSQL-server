import express from "express"
import loginRoutes from "./login/index.js"
import logoutRoutes from "./logout/index.js"
import meRoutes from "./me/index.js"
import partnerLoginRoutes from "./partner-login/index.js"
import registerRoutes from "./register/index.js"

const router = express.Router()

router.use("/register", registerRoutes)
router.use("/login", loginRoutes)
router.use("/partner-login", partnerLoginRoutes)
router.use("/logout", logoutRoutes)
router.use("/me", meRoutes)

export default router
