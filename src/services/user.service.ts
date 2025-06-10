import { connectToDatabase } from "../db/mongo"
import { User } from "../models/user.model"
import { ObjectId } from "mongodb"
import * as redis from "../db/redis"

export async function getUserById(id: string): Promise<User | null> {
    // Check if the user is in the cache
    const redisClient = await redis.getRedisClient()
    const cachedUser = await redisClient.get(`user:${id}`)
    if (cachedUser) {
        const user = JSON.parse(cachedUser) as User
        console.log("User found in cache")
        return user
    }

    // If not in cache, get from database
    const db = await connectToDatabase()
    const user = await db.collection<User>("users").findOne({ _id: new ObjectId(id) })
    if (user) {
        await redisClient.set(`user:${id}`, JSON.stringify(user))
    }
    return user
}

export async function deleteUser(id: string): Promise<boolean> {
    const db = await connectToDatabase()
    const result = await db.collection<User>("users").deleteOne({ _id: new ObjectId(id) })
    await redis.deleteCacheByID(`user:${id}`)
    return result.deletedCount === 1
}