import mongoose from "mongoose"

const HotelRequestSchema = new mongoose.Schema(
	{
		hotel: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
			index: true,
		},
		partner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Partner",
			required: true,
			index: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
			default: null,
			index: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: false,
			default: null,
			trim: true,
			lowercase: true,
		},
		checkIn: {
			type: String,
			required: false,
			default: null,
		},
		checkOut: {
			type: String,
			required: false,
			default: null,
		},
		guests: {
			type: Number,
			required: false,
			default: 1,
			min: 1,
		},
		comment: {
			type: String,
			required: false,
			default: "",
			trim: true,
			maxlength: 1000,
		},
		managerNote: {
			type: String,
			required: false,
			default: "",
			trim: true,
			maxlength: 1000,
		},
		status: {
			type: String,
			enum: ["new", "in_progress", "contacted", "closed", "cancelled"],
			default: "new",
			index: true,
		},
		source: {
			type: String,
			enum: ["website", "admin"],
			default: "website",
		},
	},
	{ timestamps: true }
)

export default mongoose.model("HotelRequest", HotelRequestSchema)