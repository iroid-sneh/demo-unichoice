import mongoose from "mongoose";

const rankCategorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const RankCategory = mongoose.model("RankCategory", rankCategorySchema);

export default RankCategory;
