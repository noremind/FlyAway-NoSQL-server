import mongoose from "mongoose"

const PartnerModel = new mongoose.Schema(
	{
		title: { type: String, required: true, unique: true, trim: true },
		description: { type: String, required: false },
		avatar: { type: String, required: false, default: null },
		rating: { type: Number, required: true, default: 0, min: 0, max: 5 },
		tours: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tour", default: [] }],
		hotels: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel", default: [] },
		],
		contacts: {
			website: {
				type: String,
				required: false,
				default: null,
			},
			address: {
				type: String,
				required: false,
				default: null,
			},
			phone: {
				type: String,
				required: false,
				default: null,
				unique: true,
			},
		},
	},
	{ timestamps: true }
)

export default mongoose.model("Partner", PartnerModel)
