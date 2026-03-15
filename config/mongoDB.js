import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async () => {
	try {
		const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.rexkz.mongodb.net/FlyAway?retryWrites=true&w=majority&appName=Cluster0`

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
