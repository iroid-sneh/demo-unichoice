import mongoose from "mongoose";

const classesSchema = new mongoose.Schema(
    {
        thumbnail: {
            type: String,
            trim: true,
            default: null,
        },
        className: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        embadedLink: {
            type: String,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        type: {
            type: [String],
            enum: ["Exclusive", "Important", "Popular", "Must Attend"],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Classes = mongoose.model("Classes", classesSchema);

export default Classes;
