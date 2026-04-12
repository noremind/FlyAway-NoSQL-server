import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async () => {
	try {
		if (mongoose.connection.readyState === 1) {
			return mongoose.connection
		}

		// const uri =
		// 	process.env.MONGODB_URI ||
		// 	`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.rexkz.mongodb.net/FlyAway?retryWrites=true&w=majority&appName=Cluster0`
		const uri =
			process.env.MONGODB_URI ||
			`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@flyaway-two.k7motbr.mongodb.net/?appName=FlyAway-Two&retryWrites=true&w=majority`

		if (!uri) {
			throw new Error("MongoDB URI is not configured")
		}

		await mongoose.connect(uri)
		console.log("MongoDB connected")
	} catch (err) {
		console.error("MongoDB connection error:", err.message)
		process.exit(1)
	}
}
