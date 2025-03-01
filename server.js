import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import routes from "./routes/index.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = process.env.PORT

connectDB()

app.use(express.json())
app.use(cors())
app.use("/api", routes)
console.log("beka")
console.log("beka")

app.listen(PORT, () =>
	console.log(`Сервер запущен на http://localhost:${PORT}`)
)
