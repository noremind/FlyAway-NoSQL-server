import mongoose from "mongoose"

const TourModel = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			min: 3,
			max: 100,
		},
		description: { type: String, required: false, max: 500 },
		avatar: { type: String, required: false, default: null },
		price: { type: Number, required: false, default: 0, min: 0 },
		discount: { type: Number, required: false, default: 0, min: 0 },
		is_hot: { type: Boolean, required: false, default: false },
		images: [{ type: String, required: false, default: null }],
		rating: { type: Number, default: 0, min: 0, max: 5 },
		reviewsCount: { type: Number, default: 0, min: 0 },
		duration: { type: String, required: false, default: "" },
		highlights: [{ type: String, default: [] }],
		dates: [{ type: String, default: [] }],
		dateDetails: [
			{
				date: { type: String, required: false, default: "" },
				text: { type: String, required: false, default: "" },
			},
		],
		availabilityDates: [
			{
				date: { type: String, required: false, default: "" },
				timeFrom: { type: String, required: false, default: "" },
				timeTo: { type: String, required: false, default: "" },
				seats: { type: Number, required: false, default: 0, min: 0 },
				bookedSeats: { type: Number, required: false, default: 0, min: 0 },
			},
		],
		departureCity: { type: String, required: false, default: "" },
		departurePoint: { type: String, required: false, default: "" },
		departureLocation: {
			x: { type: Number, required: false, default: null },
			y: { type: Number, required: false, default: null },
			address: { type: String, required: false, default: null },
			label: { type: String, required: false, default: null },
		},
		departureMapImage: { type: String, required: false, default: null },
		routeMapImage: { type: String, required: false, default: null },
		program: [
			{
				time: { type: String, required: false, default: "" },
				text: { type: String, required: false, default: "" },
			},
		],
		routePlaces: [
			{
				title: { type: String, required: false, default: "" },
				image: { type: String, required: false, default: null },
			},
		],
		packingList: [{ type: String, default: [] }],
		recommendations: [{ type: String, default: [] }],
		includes: [{ type: String, default: [] }],
		excludes: [{ type: String, default: [] }],
		ticketTypes: [
			{
				title: { type: String, required: false, default: "" },
				subtitle: { type: String, required: false, default: "" },
				price: { type: Number, required: false, default: 0, min: 0 },
			},
		],
		contacts: {
			website: { type: String, required: false, default: null },
			phone: { type: String, required: false, default: null },
			address: { type: String, required: false, default: null },
			instagram: { type: String, required: false, default: null },
		},
		partner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Partner",
			required: true,
		},
		hotels: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel", default: [] },
		],
	},
	{ timestamps: true },
)

export default mongoose.model("Tour", TourModel)
