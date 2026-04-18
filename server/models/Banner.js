import mongoose from "mongoose"

const BannerSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: false, default: "" },
		image: { type: String, required: true },
		link: { type: String, required: false, default: "/" },
		buttonText: { type: String, required: false, default: "Подробнее" },
	},
	{ timestamps: true }
)
export default mongoose.model("Banner", BannerSchema);
