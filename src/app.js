import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'



const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, // Set the origin for CORS from environment variables
    credentials:true // Allow credentials to be included in CORS requests
}))

app.use(express.json( { limit: "16kb" } )) // Parse incoming JSON requests
app.use(urlencoded({ extended: true })) // Parse URL-encoded requests
app.use(express.static("public")) // Serve static files from the "public" directory
app.use(cookieParser()) // Parse cookies from incoming requests


//routes
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)


export { app }