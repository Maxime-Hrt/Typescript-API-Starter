import { Request, Response } from "express"
import * as userService from "../services/user.service"
import { User } from "../models/user.model"

export async function getUsers(_: Request, res: Response) {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" })
    }
}

export async function getUserById(req: Request, res: Response) {
    const id = req.params.id
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

export async function createUser(req: Request, res: Response) {
    const { name, email, age} = req.body

    if (!name || !email || !age) {
        res.status(400).json({ message: "Missing required fields" })
        return
    }

    const user: Omit<User, "_id"> = { name, email, age }

    try {
        const newUser = await userService.createUser(user)
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ message: "Error creating user" })
    }
}

export async function deleteUser(req: Request, res: Response) {
    const id = req.params.id
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
