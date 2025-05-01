import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
    {
        languageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Language",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        phoneNumber: {
            type: String,
            default: null,
        },
        query: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);

export default ContactRequest;
