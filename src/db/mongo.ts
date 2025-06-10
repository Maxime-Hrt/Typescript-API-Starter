import { MongoClient, Db } from "mongodb"
import * as dotenv from "dotenv"

dotenv.config()

const uri = process.env.MONGO_URI
if (!uri) {
    throw new Error("MONGO_URI is not defined")
}

const client = new MongoClient(uri)
let db: Db | null = null

export async function connectToDatabase() {
    if (!db) {
        await client.connect()
        db = client.db(process.env.MONGO_DB_NAME)
        console.log("MongoDB connected")
    }
    return db
}

export async function closeDatabase() {
    await client.close()
    console.log("MongoDB connection closed")
}