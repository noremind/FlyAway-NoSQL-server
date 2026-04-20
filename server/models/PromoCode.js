import mongoose from "mongoose"

const PromoCodeSchema = new mongoose.Schema(
	{
		title: { type: String, required: false, default: "" },
		code: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			uppercase: true,
		},
		discountType: {
			type: String,
			enum: ["percent", "fixed"],
			required: true,
		},
		value: {
			type: Number,
			required: true,
			min: 0,
		},
		startsAt: { type: String, required: false, default: "" },
		endsAt: { type: String, required: false, default: "" },
		isActive: { type: Boolean, required: false, default: true },
		targetType: {
			type: String,
			enum: ["all", "tour", "hotel"],
			default: "all",
		},
		tour: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tour",
			required: false,
			default: null,
		},
		hotel: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Hotel",
			required: false,
			default: null,
		},
		partner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Partner",
			required: false,
			default: null,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
			default: null,
		},
	},
	{ timestamps: true }
)

export default mongoose.model("PromoCode", PromoCodeSchema)
