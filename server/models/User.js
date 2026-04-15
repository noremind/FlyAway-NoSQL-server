import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		phone: {
			type: String,
			required: false,
			trim: true,
		},
		password: { type: String, required: false },
		email: {
			type: String,
			required: true,
			unique: true,
			sparse: true,
			lowercase: true,
			trim: true,
		},
		role: {
			type: String,
			enum: ["admin", "user", "partner"],
			default: "user",
			required: true,
		},
		birthDate: { type: String, default: null },
		gender: {
			type: String,
			default: null,
		},
		verificationCode: { type: String, required: false, default: null },
		isVerified: { type: Boolean, default: true },
		avatar: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
)

UserSchema.index(
	{ phone: 1 },
	{
		unique: true,
		partialFilterExpression: {
			phone: { $type: "string" },
		},
	}
)

export default mongoose.model("User", UserSchema)
