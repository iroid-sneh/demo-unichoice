import mongoose from "mongoose";

const isInterestedSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Colleges",
        },
    },
    { timestamps: true }
);

const Interested = mongoose.model("Interested", isInterestedSchema);

export default Interested;
