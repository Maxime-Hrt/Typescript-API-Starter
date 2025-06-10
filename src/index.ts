import express from "express"
import { connectToDatabase, closeDatabase } from "./db/mongo"
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import userRouter from "./routes/user.routes"
import { connectToRedis, closeRedis } from "./db/redis"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use("/users", userRouter)
app.use('/auth', authRoutes)

Promise.all([connectToRedis(), connectToDatabase()])
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch((err) => {
        console.error('Failed to initialize services:', err)
        process.exit(1)
    });

process.on("SIGINT", async () => {
    await closeRedis()
    await closeDatabase()
    process.exit(0)
})