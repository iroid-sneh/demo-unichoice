import mongoose from "mongoose";

const streamSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
});

const Stream = mongoose.model("Stream", streamSchema);

export default Stream;
