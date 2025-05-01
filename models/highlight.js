import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
    {
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Colleges",
        },
        images: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const Highlights = mongoose.model("Highlights", highlightSchema);

export default Highlights;
