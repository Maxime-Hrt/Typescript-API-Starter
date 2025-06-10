import { connectToDatabase } from "../db/mongo"
import { User } from "../models/user.model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const saltRounds = 10
const JWT_SECRET = process.env.JWT_SECRET

export async function signUp(name: string, email: string, password: string): Promise<User> {
    const db = await connectToDatabase()
    const existingUser = await db.collection<User>("users").findOne({ email })
    if (existingUser) {
        throw new Error("User already exists")
    }

    const hash = await bcrypt.hash(password, saltRounds)
    const user: Omit<User, "_id"> = { name, email, password: hash, role: 'user' }
    const result = await db.collection<User>("users").insertOne(user)
    return { ...user, _id: result.insertedId }
}

export async function signIn(email: string, password: string): Promise<User> {
    const db = await connectToDatabase()
    const user = await db.collection<User>("users").findOne({ email })
    if (!user) {
        throw new Error("Invalid credentials")
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw new Error("Invalid credentials")
    }

    return user
}

export function generateTokens(user: User) {
    const accessTokenPayload = {
        userId: user._id?.toString(),
        role: user.role
    }

    const refreshTokenPayload = {
        userId: user._id?.toString(),
        role: user.role
    }

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined")
    }

    const accessToken = jwt.sign(accessTokenPayload, JWT_SECRET, { expiresIn: "15m" as jwt.SignOptions["expiresIn"] })
    const refreshToken = jwt.sign(refreshTokenPayload, JWT_SECRET, { expiresIn: "30d" as jwt.SignOptions["expiresIn"] })

    return { accessToken, refreshToken }
}