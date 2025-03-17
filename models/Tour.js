import mongoose from "mongoose"

const TourModel = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    avatar: { type: String, required: false, default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }],
    // reviews: [{ type: String, required: false }],
  },
  { timestamps: true }
)

export default mongoose.model("Tour", TourModel)
