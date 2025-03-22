import mongoose from "mongoose"

const adSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        image: {type: String, required: true},
        link: { type: mongoose.Schema.Types.Mixed, required: true, refPath: "type" },
        type: {
            type: String,
            enum: ["our_tour", "our_hotel", "our_partner", "another"],
            required: true
        }, 
    },
    { timestamps: true }
)
export default mongoose.model("Ads", adSchema);





