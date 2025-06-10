import { createClient } from "redis"
import * as dotenv from "dotenv"

dotenv.config()

let redisClient: ReturnType<typeof createClient> | null = null

export async function connectToRedis(): Promise<void> {
    redisClient = createClient({
        socket: {
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: parseInt(process.env.REDIS_PORT || '6379', 10)
        },
        password: process.env.REDIS_PASSWORD || undefined,
    })

    redisClient.on("error", (err) => {
        console.error("Redis error:", err)
    })

    await redisClient.connect();
    console.log('Connected to Redis')
}

export async function closeRedis(): Promise<void> {
    if (redisClient) {
        await redisClient.close()
        console.log("Redis connection closed")
    }
}

export async function deleteCacheByID(cacheKey: string): Promise<void> {
    if (!redisClient) throw new Error("Redis client not initialized")

    try {
        await redisClient.del(cacheKey)
        console.log(`Deleted cache key: ${cacheKey}`)
    } catch (error) {
        console.error(`Error deleting cache key: ${cacheKey}`, error)
        throw error
    }
}

export async function getRedisClient(): Promise<ReturnType<typeof createClient>> {
    if (!redisClient) throw new Error('Redis client not initialized');
    return redisClient
}