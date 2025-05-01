import mongoose from "mongoose";

const collegesSchema = new mongoose.Schema(
    {
        index: {
            type: Number,
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
        state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "State",
            default: null,
        },
        city: {
            type: String,
            default: null,
        },
        nirfRank: {
            type: Number,
            default: null,
        },
        stream: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Stream",
                default: null,
            },
        ],
        averageTutionFee: {
            type: String,
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
        top200: {
            type: Boolean,
            default: false,
        },
        freeApplication: {
            type: Boolean,
            default: false,
        },
        collegeAppLink: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Colleges = mongoose.model("Colleges", collegesSchema);

export default Colleges;
