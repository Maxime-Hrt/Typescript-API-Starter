import { connectToDatabase } from "../db/mongo"
import { User } from "../models/user.model"
import { ObjectId } from "mongodb"

export async function getAllUsers(): Promise<User[]> {
    const db = await connectToDatabase()
    return db.collection<User>("users").find({}).toArray()
}

export async function getUserById(id: string): Promise<User | null> {
    const db = await connectToDatabase()
    return db.collection<User>("users").findOne({ _id: new ObjectId(id) })
}

export async function createUser(user: Omit<User, "_id">): Promise<User> {
    const db = await connectToDatabase()
    const result = await db.collection<User>("users").insertOne(user)
    return { ...user, _id: result.insertedId }
}

export async function deleteUser(id: string): Promise<boolean> {
    const db = await connectToDatabase()
    const result = await db.collection<User>("users").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
}