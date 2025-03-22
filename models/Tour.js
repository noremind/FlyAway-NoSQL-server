import mongoose from "mongoose"

const TourModel = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			min: 3,
			max: 100,
		},
		description: { type: String, required: false, max: 500 },
		avatar: { type: String, required: false, default: null },
		rating: { type: Number, default: 0, min: 0, max: 5 },
		price: { type: Number, required: true, default: 0 },
		discount: { type: Number, required: false, default: null },
		is_hot: { type: Boolean, required: false, default: false },
		images: [{ type: String, required: false, default: null }],
		partner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Partner",
			required: true,
		},
		hotels: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel", default: [] },
		],
	},
	{ timestamps: true }
)

export default mongoose.model("Tour", TourModel)
