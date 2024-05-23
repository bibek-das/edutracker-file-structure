const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    day: {
        type: String,
    },
    date: {
        type: String,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    department: {
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
    },
    teacher: {
        type: String
    },
    room: {
        type: String,
    },
    status: {
        type: String,
    },
    classContent:{
        type: String,
    },
    reason:{
        type: String,
    }
});

const Schedule = new mongoose.model("schedule", scheduleSchema);

module.exports = Schedule;
