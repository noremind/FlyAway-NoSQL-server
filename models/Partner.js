import mongoose from "mongoose"

const PartnerModel = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: false },
		avatar: { type: String, required: false, default: null },
		rating: { type: Number, default: 0, min: 0, max: 5 },
		tours: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tour" }],
		hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }],
		// reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
	},
	{ timestamps: true }
)


export default mongoose.model("Partner", PartnerModel)
