import express, {Request, Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose'
import MyUserRoutes from './routes/MyUserRoutes';
import {v2 as cloudinary} from "cloudinary"
import myRestaurantRoute from "./routes/MyRestaurantRoute"

mongoose
    .connect(process.env.MONGO_CONNECTION_STRING as string)
    .then(() => console.log('Connected to MongoDB'))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

const app = express()

app.use(express.json())
app.use(cors())


const port = process.env.PORT ? Number(process.env.PORT) : 6001

app.get("/health", async (req: Request, res: Response) => {
    res.status(200).json({status: "health ok!"})
})

app.use("/api/my/user", MyUserRoutes)
app.use("/api/my/restaurant", myRestaurantRoute) 

app.get('/test', async (req: Request, res: Response) => {
    res.json({ message: "hello" })
})

app.listen(port, '0.0.0.0', () => {
    console.log("server started")
})