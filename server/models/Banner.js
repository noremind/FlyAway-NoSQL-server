import mongoose from "mongoose"

const BannerSchema = new mongoose.Schema(
    {
        title: { type:String, required: true},
        image: { type:String, required: true},
        tour:{ type:mongoose.Schema.Types.ObjectId, ref:"Tour",required:true}
    },
    { timestamps: true }
)
export default mongoose.model("Banner", BannerSchema);





