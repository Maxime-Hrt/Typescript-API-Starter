import { Router } from "express"
import * as userController from "../controllers/user.controller"
import * as authMiddleware from "../middlewares/auth.middleware"

const router = Router()

// router.get('/', userController.getUsers)
router.get('/me', authMiddleware.authenticateToken, userController.getUserById)
// router.get('/:id', userController.getUserById)
// router.post('/', userController.createUser)
// router.delete('/:id', userController.deleteUser)

export default router