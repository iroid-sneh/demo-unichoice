import mongoose from "mongoose";

const updateSchema = new mongoose.Schema(
    {
        type: {
            type: Number,
            default: null,
        },
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            default: null,
        },
        tagId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag",
            default: null,
        },
        title: {
            type: String,
            default: null,
        },
        description: {
            type: String,
            default: null,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Updates = mongoose.model("Updates", updateSchema);

export default Updates;
