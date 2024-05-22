const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    name: { 
        type: String,  
    },
    authID: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    department: { 
        type : String,
    },
    designation: {
        type: String,
    },
    imageBase64 : {
        type : String,
    },
    phone: {
        type : String, 
    },
    course: {
        type : [String],
    },
});

const Teacher = mongoose.model("teacher", teacherSchema);

module.exports = Teacher;