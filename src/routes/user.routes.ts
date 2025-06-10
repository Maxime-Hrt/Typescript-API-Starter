import { Router } from "express"
import * as userController from "../controller/user.controller"

const router = Router()

router.get('/', userController.getUsers)
router.get('/:id', userController.getUserById)
router.post('/', userController.createUser)
router.delete('/:id', userController.deleteUser)

export default router