import mongoose from "mongoose"

const HotelSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		// tour: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "Tour",
		// 		required: true,
		// 	},
		// ],
		partner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Partner",
			required: true,
		},
		description: { type: String, required: true },
		rating: { type: Number, default: 0, min: 0, max: 5 },
		images: [{ type: String, required: false, default: null }],
		location: { type: String, required: true },
		content: { type: String, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model("Hotel", HotelSchema)
