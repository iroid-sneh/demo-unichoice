import mongoose from "mongoose";

const accessTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isRevoked: {
            type: Boolean,
            required: false,
            default: false,
        },
        expiresAt: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const AccessToken = mongoose.model("AccessToken", accessTokenSchema);

export default AccessToken;
