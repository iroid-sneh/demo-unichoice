import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
});

const State = mongoose.model("State", stateSchema);

export default State;
