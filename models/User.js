import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		phone: { type: String, required: true, unique: true },
		password: { type: String, required: false }, // Необязательное поле на этапе регистрации
		email: { type: String, default: null },
		birthDate: { type: String, default: null },
		gender: {
			type: String,
			// enum: ["Мужчина", "Женщина", "Другое", ""],
			default: null,
		},
		verificationCode: { type: String, required: false }, // 4-значный код для верификации
		isVerified: { type: Boolean, default: false }, // Флаг подтверждения телефона
		avatar: {
			type: String,
			default:
				"https://no-sql-project-server.vercel.app/storage/images/avatar.avif",
		},
	},
	{ timestamps: true }
)

export default mongoose.model("User", UserSchema)
