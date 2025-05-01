import mongoose from "mongoose";

const fcmTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        deviceId: {
            type: String,
            required: false,
        },
        token: {
            type: String,
            required: false,
        },
        platform: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const fcmToken = mongoose.model("fcmToken", fcmTokenSchema);

export default fcmToken;
