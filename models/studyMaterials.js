import mongoose from "mongoose";

const studyMaterialsSchema = new mongoose.Schema(
    {
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudyColleges",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        fileLinks: [
            {
                fileLink: { type: String, required: true },
                docTitle: { type: String, required: true },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const StudyMaterials = mongoose.model("StudyMaterials", studyMaterialsSchema);

export default StudyMaterials;
