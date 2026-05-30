import mongoose from "mongoose"

const HotelReviewSchema = new mongoose.Schema(
	{
		hotel: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
			index: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: true,
			trim: true,
			minlength: 10,
			maxlength: 1500,
		},
	},
	{ timestamps: true }
)

HotelReviewSchema.index({ hotel: 1, createdBy: 1 }, { unique: true })

export default mongoose.model("HotelReview", HotelReviewSchema)
