import mongoose from "mongoose"

const MedicineSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, min: 2, max: 50 },
		image: { type: String, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model("Medicine", MedicineSchema)
