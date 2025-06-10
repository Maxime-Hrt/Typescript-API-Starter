import express from "express"
import { connectToDatabase, closeDatabase } from "./db/mongo"
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import userRouter from "./routes/user.routes"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use("/users", userRouter)
app.use('/auth', authRoutes)

connectToDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    });

process.on("SIGINT", async () => {
    await closeDatabase()
    process.exit(0)
})