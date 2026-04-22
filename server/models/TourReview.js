import mongoose from "mongoose"

const TourReviewSchema = new mongoose.Schema(
	{
		tour: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tour",
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

TourReviewSchema.index({ tour: 1, createdBy: 1 }, { unique: true })

export default mongoose.model("TourReview", TourReviewSchema)