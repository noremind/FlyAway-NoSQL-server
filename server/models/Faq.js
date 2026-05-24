import mongoose from "mongoose"

const FaqSchema = new mongoose.Schema(
	{
		question: { type: String, required: true, trim: true },
		answer: { type: String, required: true, trim: true },
		category: { type: String, required: false, default: "Общее", trim: true },
		order: { type: Number, required: false, default: 0 },
		isActive: { type: Boolean, required: false, default: true },
	},
	{ timestamps: true }
)

export default mongoose.model("Faq", FaqSchema)
