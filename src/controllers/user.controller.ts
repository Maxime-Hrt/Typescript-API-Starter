import { Request, Response } from "express"
import * as userService from "../services/user.service"
import { RequestWithMiddleware } from "../types/auth"

export async function getUserById(req: Request, res: Response) {
    const user = (req as RequestWithMiddleware).user
    if (!user.id) {
        res.status(401).json({ message: "Unauthorized - Id is required" })
        return
    }

    const id = user.id
    
    try {
        const user = await userService.getUserById(id)
        if (!user) {
            res.status(404).json({ message: "User not found" })
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" })
    }
}

export async function deleteUser(req: Request, res: Response) {
    const user = (req as RequestWithMiddleware).user
    if (!user.id) {
        res.status(401).json({ message: "Unauthorized - Id is required" })
        return
    }

    const id = user.id

    try {
        const result = await userService.deleteUser(id)
        if (result) {
            res.status(204).send()
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" })
    }
}
