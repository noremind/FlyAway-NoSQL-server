import mongoose from "mongoose"

const ContentViewSchema = new mongoose.Schema(
	{
		contentType: {
			type: String,
			enum: ["tour", "hotel"],
			required: true,
			index: true,
		},
		content: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			index: true,
		},
		partner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Partner",
			default: null,
			index: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
			index: true,
		},
		viewedAt: {
			type: Date,
			default: Date.now,
			index: true,
		},
	},
	{ timestamps: true }
)

ContentViewSchema.index({ contentType: 1, content: 1, viewedAt: -1 })
ContentViewSchema.index({ partner: 1, viewedAt: -1 })

export default mongoose.model("ContentView", ContentViewSchema)
