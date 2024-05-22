const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  deptID: {
    type: Number,
    unique: true,
    required: true,
  },
  deptName: {
    type: String,
    required: true,
  },
  deptFullName: {
    type: String,
  },
});

const Department = new mongoose.model("department", departmentSchema);

module.exports = Department;
