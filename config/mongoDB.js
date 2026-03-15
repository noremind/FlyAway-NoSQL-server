import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async () => {
	try {
		const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@flyaway.7rlc0lc.mongodb.net/FlyAway`

		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		console.log("Подключено к MongoDB")
	} catch (err) {
		console.error("Ошибка подключения к MongoDB:", err)
		process.exit(1)
	}
}
