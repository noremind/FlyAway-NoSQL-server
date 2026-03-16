import dotenv from "dotenv"
import app from "./app.js"
import { connectDB } from "./config/db.js"

dotenv.config()

const PORT = Number(process.env.PORT) || 5000

await connectDB()

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
