import mongoose from "mongoose";

const collegeApplicationsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Colleges",
        },
        name: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            default: null,
        },
        phone: {
            type: String,
            default: null,
        },
        percentage: {
            type: Number,
            default: null,
        },
    },
    { timestamps: true }
);

const CollegeApplications = mongoose.model(
    "CollegeApplications",
    collegeApplicationsSchema
);

export default CollegeApplications;
