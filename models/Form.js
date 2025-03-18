import mongoose from "mongoose"

const FormSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String, required: true },
		comment: { type: String, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model("Form", FormSchema)
