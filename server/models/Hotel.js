import mongoose from "mongoose"

const RoomTypeSchema = new mongoose.Schema(
	{
		name: { type: String, required: false, default: "" },
		price: { type: Number, required: false, default: 0, min: 0 },
		description: { type: String, required: false, default: "" },
		benefits: [{ type: String, default: [] }],
		images: [{ type: String, required: false, default: null }],
	},
	{ _id: true }
)

const NearbyPointSchema = new mongoose.Schema(
	{
		label: { type: String, required: false, default: "" },
		value: { type: String, required: false, default: "" },
	},
	{ _id: false }
)

const HotelSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		partner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Partner",
			required: true,
		},
		description: { type: String, required: true, default: "" },
		content: { type: String, required: true, default: "" },
		rating: { type: Number, default: 0, min: 0, max: 5 },
		reviewsCount: { type: Number, default: 0, min: 0 },
		location: { type: String, required: true, default: "" },
		images: [{ type: String, required: false, default: null }],
		price: { type: Number, required: false, default: 0, min: 0 },
		discount: { type: Number, required: false, default: 0, min: 0, max: 100 },
		is_hot: { type: Boolean, required: false, default: false },
		coordinates: {
			x: { type: Number, required: false, default: null },
			y: { type: Number, required: false, default: null },
			address: { type: String, required: false, default: null },
			label: { type: String, required: false, default: null },
		},
		contacts: {
			website: { type: String, required: false, default: null },
			phone: { type: String, required: false, default: null },
			address: { type: String, required: false, default: null },
			instagram: { type: String, required: false, default: null },
		},
		nearby_points: { type: [NearbyPointSchema], default: [] },
		policy: [{ type: String, default: [] }],
		meals: [{ type: String, default: [] }],
		amenities: [{ type: String, default: [] }],
		paid_services: [{ type: String, default: [] }],
		family_features: [{ type: String, default: [] }],
		accessibility: [{ type: String, default: [] }],
		entertainment: [{ type: String, default: [] }],
		room_types: { type: [RoomTypeSchema], default: [] },
	},
	{ timestamps: true }
)

export default mongoose.model("Hotel", HotelSchema)
