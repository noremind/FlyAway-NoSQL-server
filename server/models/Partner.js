import mongoose from "mongoose"

const PartnerModel = new mongoose.Schema(
	{
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
			index: true,
		},
		title: { type: String, required: true, unique: true, trim: true },
		description: { type: String, required: false },
		avatar: { type: String, required: false, default: null },
		logo: { type: String, required: false, default: null },
		email: {
			type: String,
			required: false,
			lowercase: true,
			trim: true,
		},
		password: { type: String, required: false, select: false },
		bin: { type: String, required: false, trim: true },
		ownerName: { type: String, required: false, trim: true },
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
			},
		},
	},
	{ timestamps: true }
)

PartnerModel.index(
	{ email: 1 },
	{
		unique: true,
		partialFilterExpression: {
			email: { $type: "string" },
		},
	}
)

PartnerModel.index(
	{ bin: 1 },
	{
		unique: true,
		partialFilterExpression: {
			bin: { $type: "string" },
		},
	}
)

PartnerModel.index(
	{ "contacts.phone": 1 },
	{
		unique: true,
		partialFilterExpression: {
			"contacts.phone": { $type: "string" },
		},
	}
)

export default mongoose.model("Partner", PartnerModel)
