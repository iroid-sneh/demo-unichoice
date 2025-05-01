import mongoose from "mongoose";

const studyCollegesSchema = new mongoose.Schema(
    {
        collegeName: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        logo: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const StudyColleges = mongoose.model("StudyColleges", studyCollegesSchema);

export default StudyColleges;
