import { Router } from "express"
import * as userController from "../controllers/user.controller"
import * as authMiddleware from "../middlewares/auth.middleware"

const router = Router()

router.get('/', authMiddleware.authenticateToken, userController.getUserById)
router.delete('/', authMiddleware.authenticateToken, userController.deleteUser)

export default router