import mongoose from "mongoose";

const bannersSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            default: null,
        },
        link: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const Banners = mongoose.model("Banners", bannersSchema);

export default Banners;
