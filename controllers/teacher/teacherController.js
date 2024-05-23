const Teacher = require("../../models/admin/teacher");
const Department = require("../../models/admin/department")
const Schedule = require("../../models/admin/schedule");

exports.profileView = async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
      const dept = await Department.findOne({deptName: teacher.department})
      const user = req.session.user;
      res.render("./teachers/teacherProfile", {teacher, dept, user});
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
};

exports.logView = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    const classLog = await Schedule.find({teacher: teacher.authID}).sort({date:1});
    res.render("./teachers/class_log", { teacher, classLog});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.markAttended = async (req, res) => {
  const updateData = {
    status: "attended",
    classContent: req.body.classContent,
  };
  const id = req.params.id;
  await Schedule.findByIdAndUpdate(id, updateData, {new: true})
  const schedule = await Schedule.findById(req.params.id);
  const teacher = await Teacher.findOne({authID: schedule.teacher});
  res.redirect(`./${teacher._id}`);
}

exports.cancelClass = async(req, res) =>{
  const {reason} = req.body;
  console.log(reason);
  const updateData = {
    status: "canceled",
    reason: reason,
  }
  const id = req.params.id;
  await Schedule.findByIdAndUpdate(id, updateData, {new: true});
  res.redirect(".");
}


