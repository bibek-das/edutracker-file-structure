const Teacher = require("../../models/admin/teacher");
const Department = require("../../models/admin/department")
const Schedule = require("../../models/admin/schedule");

exports.profileView = async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
      const dept = await Department.findOne({deptName: teacher.department})
      res.render("./teachers/teacherProfile", {teacher, dept});
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
};

exports.logView = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    const classLog = await Schedule.find({teacher: teacher.authID}).sort({startTime:1});
    res.render("./teachers/class_log", { teacher, classLog});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


