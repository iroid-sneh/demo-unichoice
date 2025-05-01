import mongoose from "mongoose";

const collegeRankCourseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const CollegeRankCourse = mongoose.model(
    "CollegeRankCourse",
    collegeRankCourseSchema
);

export default CollegeRankCourse;
