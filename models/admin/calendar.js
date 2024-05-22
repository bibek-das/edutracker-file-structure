const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
    date:{
        type: String,
        Unique: true
    },
    event:{
        type: String,
    }
})

const Calendar = new mongoose.model("calendar", calendarSchema);

module.exports = Calendar;