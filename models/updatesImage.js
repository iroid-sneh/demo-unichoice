import mongoose from "mongoose";

const updateImageSchema = new mongoose.Schema(
    {
        updateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Updates",
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            default: null,
        },
        isVideo: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const UpdatesImages = mongoose.model("UpdatesImages", updateImageSchema);

export default UpdatesImages;
