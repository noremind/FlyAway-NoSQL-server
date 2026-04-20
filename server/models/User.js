import mongoose from "mongoose"

const WalletTransactionSchema = new mongoose.Schema(
	{
		name: { type: String, required: false, default: "" },
		type: { type: String, required: false, default: "" },
		amount: { type: Number, required: false, default: 0 },
		currency: { type: String, required: false, default: "KZT" },
		note: { type: String, required: false, default: "" },
		createdAt: { type: Date, required: false, default: Date.now },
	},
	{ _id: true }
)

const TourBookingSchema = new mongoose.Schema(
	{
		tour: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tour",
			required: true,
		},
		availabilityDateId: { type: String, required: false, default: "" },
		date: { type: String, required: false, default: "" },
		timeFrom: { type: String, required: false, default: "" },
		timeTo: { type: String, required: false, default: "" },
		guests: { type: Number, required: false, default: 1, min: 1 },
		ticketSelections: [
			{
				title: { type: String, required: false, default: "" },
				quantity: { type: Number, required: false, default: 0, min: 0 },
				price: { type: Number, required: false, default: 0, min: 0 },
				subtotal: { type: Number, required: false, default: 0, min: 0 },
			},
		],
		promoCode: { type: String, required: false, default: null },
		promoDiscountAmount: { type: Number, required: false, default: 0, min: 0 },
		tourDiscountPercent: { type: Number, required: false, default: 0, min: 0 },
		paidWithBonuses: { type: Number, required: false, default: 0, min: 0 },
		paymentMethod: { type: String, required: false, default: "card" },
		total: { type: Number, required: false, default: 0, min: 0 },
		status: {
			type: String,
			enum: ["active", "completed", "cancelled"],
			default: "active",
		},
		createdAt: { type: Date, required: false, default: Date.now },
	},
	{ _id: true }
)

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
		bonusBalance: {
			type: Number,
			default: 0,
			min: 0,
		},
		favouriteTours: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Tour",
				default: [],
			},
		],
		walletTransactions: {
			type: [WalletTransactionSchema],
			default: [],
		},
		tourBookings: {
			type: [TourBookingSchema],
			default: [],
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
