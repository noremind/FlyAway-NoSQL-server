import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import { hotelRoutes } from "./routes/hotels.js"

const app = express()
const PORT = 5000

connectDB()

app.use(express.json())
app.use(cors())

//ROUTES
app.use("/api/hotels", hotelRoutes)

app.listen(PORT, () =>
	console.log(`Сервер запущен на http://localhost:${PORT}`)
)
