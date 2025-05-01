import stateData from "./state";
import streamData from "./stream";
import State from "../models/state";
import Stream from "../models/stream";
import Admin from "../models/admin";

const admin = async () => {
    const adminData = {
        email: "admin@gmail.com",
        password:
            "$2y$12$ghkZX2MM/douHFJnsO9iUu/LM88cQ/TcK8WZR4oIkKJF7nS1ItVTO", //admin@123
    };

    const findAdmin = await Admin.find({});

    if (findAdmin.length === 0) {
        const insert = await Admin.create(adminData);
        console.log("Admin Seeded");
        return true;
    }

    const findState = await State.find({});

    if (findState.length === 0) {
        const insert = await State.create(stateData);
        console.log("States Seeded");
        return true;
    }

    const findStream = await Stream.find({});

    if (findStream.length === 0) {
        const insert = await Stream.create(streamData);
        console.log("Streams Seeded");
        return true;
    }
};

admin();

export default admin;
