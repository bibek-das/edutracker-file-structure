const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema({
    day:{
        type: String,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    batch: {
        type: String,
    },
    section: {
        type: String,
    },
    course: {
        type: String
        // ref: "course",
    },
    teacher: {
        type: String
    },
    room: {
        type: String,
    },
    department:{
        type: String,
    },
});

const Routine = new mongoose.model("routine", routineSchema);

module.exports = Routine;
