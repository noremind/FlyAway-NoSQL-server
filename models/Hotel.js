import mongoose from "mongoose"

const HotelSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		tour_company: { type: String, required: true },
		description: { type: String, required: true },
		rating: { type: Number, default: 0, min: 0, max: 5 },
		images: [{ type: String }],
		location: { type: String, required: true },
		content: { type: String, required: true },
		// reviews: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "Reviews",
		// },
	},
	{ timestamps: true }
)

export default mongoose.model("Hotel", HotelSchema)
