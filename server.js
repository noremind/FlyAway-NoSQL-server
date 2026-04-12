import dotenv from "dotenv"
import { pathToFileURL } from "url"
import app from "./server/app.js"
import { connectDB } from "./server/config/db.js"

dotenv.config()

await connectDB()

const isDirectRun = process.argv[1]
	? import.meta.url === pathToFileURL(process.argv[1]).href
	: false

if (isDirectRun) {
	const PORT = process.env.PORT || 5000

	app.listen(PORT, () => {
		console.log(`FlyAway server started on http://localhost:${PORT}`)
	})
}

export default app
