import mongoose from "mongoose"

const ExcursionSchema = new mongoose.Schema(
	{
		image: { type: String, required: true },
		title: { type: String, required: true, min: 2, max: 50 },
		items: [
			{
				_id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Генерация _id для каждого item
				images: { type: [String], default: [] },
				title: { type: String, required: true },
				content: { type: String, default: "" },
			},
		],
	},
	{ timestamps: true }
)

export default mongoose.model("Excursion", ExcursionSchema)
