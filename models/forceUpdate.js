import mongoose from "mongoose";

const forceUpdateSchema = new mongoose.Schema(
    {
        device_type: {
            type: String,
            required: true,
            enum: ["android", "ios"],
        },
        min_version: {
            type: String,
            required: true,
        },
        current_version: {
            type: String,
            required: true,
        },
        appLink: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const forceUpdate = mongoose.model("forceUpdate", forceUpdateSchema);

export default forceUpdate;
