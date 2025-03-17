import mongoose from "mongoose"

const YachtSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, min: 2, max: 50 },
		description: { type: String, required: false },
		price: { type: Number, required: false, default: null },
		old_price: { type: Number, required: true, default: null },
		content: { type: String, required: false, default: null },
		images: [{ type: String, required: false, default: null }],
	},
	{ timestamps: true }
)

export default mongoose.model("Yacht", YachtSchema)
