const Department = require("../../models/admin/department");
const Calendar = require("../../models/admin/calendar");
const Teacher = require("../../models/admin/teacher");
const User = require("../../models/authentication/auth");
const Routine = require("../../models/admin/routine");
const Schedule = require("../../models/admin/schedule");
const fs = require('fs');
const bodyParser = require("body-parser");
//helper
function formatTime(timeStr) {
  let [time, period] = timeStr.split(' ');
  let [hour, minute] = time.split(':');
  hour = parseInt(hour, 10);
  minute = parseInt(minute, 10);
  hour = hour.toString().padStart(2, '0');
  minute = minute.toString().padStart(2, '0');
  const formattedTime = `${hour}:${minute} ${period.toUpperCase()}`;
  return formattedTime;
}

//helper
function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
      hours = '00';
  }
  if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
  }
  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

//helper
function isTimeBetween(startTimeStr, endTimeStr, checkTimeStr) {
  const startTime = convertTo24Hour(startTimeStr);
  const endTime = convertTo24Hour(endTimeStr);
  const checkTime = convertTo24Hour(checkTimeStr);

  // Handle cases where the end time is past midnight
  if (startTime < endTime) {
      // Simple case where start and end times are on the same day
      return startTime <= checkTime && checkTime <= endTime;
  } else {
      // Case where end time is past midnight
      return startTime <= checkTime || checkTime <= endTime;
  }
}

exports.homeView = (req, res) => {
  try {
    res.render("./admin/adminHome");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.manageTeacherView = async (req, res) => {
  try {
    const departments = await Department.find();
    res.render("./admin/manageTeacher", { departments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.calendarView = (req, res) => {
  try {
    const msg = req.query.message;
    res.render("./admin/academicCalendar", {msg});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.routineView = async (req, res) => {
  try {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    const departments = await Department.find();
    const routineData = await Routine.find();
    const msg = req.query.message;
    res.render("./admin/routine", {msg, departments, days, routineData});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.allTeachersView = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.render("./admin/allTeachers", { teachers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.addCalendar = async (req, res) => {
  try {
    const holiday = req.body;
    const newCalendar = new Calendar(holiday);
    await newCalendar.save();

    const dateString = `${newCalendar.date}`;

    // Use a regular expression to find the first 4-digit year
    const yearMatch = dateString.match(/\b\d{4}\b/);

    const yearPosition = yearMatch.index;
    const newString = dateString.substring(0, yearPosition + 4);
    // Output: "Sat May 18 2024"

    const msg = `Event addad on ${newString}`;
    res.redirect(`./academicCalendar?message=${encodeURIComponent(msg)}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


//manageTeacher Post method

exports.addTeacher = (req, res , next) => {
  const files = req.files;
  const tempTeacher = req.body;
  tempTeacher.authID = tempTeacher.department + '-' + "0001";

  if(!files){
      const error = new Error('Please choose files');
      error.httpStatusCode = 400;
      return next(error)
  }

  Teacher.aggregate([
    { $match: { department: tempTeacher.department } }, // Filter documents where the name is the requested dept.
    { $group: { _id: null, authID: { $max: "$authID" } } } // Group the filtered documents and find the maximum ID.
  ]).then(result => {
    //incrementing the maximum ID if teacher exists in the particular department
    if (result.length > 0) {
        let maxID = result[0].authID;
        const matches = maxID.match(/^([A-Za-z]+)-(\d+)$/);
        const prefix = matches[1];
        let ID = parseInt(matches[2]);
        ID++;
        const incrementedID = ID.toString().padStart(matches[2].length, '0');
        const newID = `${prefix}-${incrementedID}`;
        tempTeacher.authID = newID;
    }
    // convert images into base64 encoding
    let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path)
      return encode_image = img.toString('base64')
    });

    let final = imgArray.map((src, index) => {

      // create object to store data in the collection
      let finalTeacher = {
        name: tempTeacher.name,
        authID: tempTeacher.authID,
        email: tempTeacher.email,
        department: tempTeacher.department,
        designation: tempTeacher.designation, 
        imageBase64 : src,
        phone: tempTeacher.phone
      }

      let newTeacher = new Teacher(finalTeacher);

      return newTeacher.save();
    });

    let tempUser = {
      email: tempTeacher.email,
      password: tempTeacher.password,
      role: "Teacher",
    }
    let newUser = new User(tempUser);
    newUser.save();

    res.redirect("./manageTeacher");
  });
};

exports.visitTeacherProfile = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  const dept = await Department.findOne({deptName: teacher.department})
  res.render('./teachers/teacherProfile', { teacher, dept });
}

exports.addRoutine = async (req, res) => {
  const tempRoutine = req.body;
  const teacherExists = await Teacher.find({authID:tempRoutine.teacher});
  if(JSON.stringify(teacherExists) === "[]"){
    const msg = `${tempRoutine.teacher} id not found`;
    res.redirect(`./routine?message=${encodeURIComponent(msg)}`);
    return;
  }
  let start = tempRoutine.startTimeHours + ":" + tempRoutine.startTimeMinutes + " " + tempRoutine.startTimePeriod;
  let end = tempRoutine.endTimeHours + ":" + tempRoutine.endTimeMinutes + " " + tempRoutine.endTimePeriod;
  start = formatTime(start);
  end = formatTime(end);
  const { teacher, batch, section, room, day, deptID } = req.body;

  const results = await Routine.find({
    $or: [
      {
        $and: [
          { teacher: teacher },
          { day: day },
        ]
      },
	    {
        $and: [
          { room: room },
          { day: day },
        ]
      },
	    {
        $and: [
          { day: day },
          { department: deptID },
          {batch: batch},
          {section: section},
        ]
      },
    ]
  });

  for(const result of results){
    if(isTimeBetween(start, end, result.startTime) || isTimeBetween(start, end, result.endTime)){
      const msg = "Provided time conflicts with other Datas";
      res.redirect(`./routine?message=${encodeURIComponent(msg)}`);
      return;
    }
  }

  
  const routineInfo = {
    startTime: formatTime(start),
    endTime: formatTime(end),
    batch: tempRoutine.batch,
    section: tempRoutine.section,
    course: tempRoutine.course,
    teacher: tempRoutine.teacher,
    room: tempRoutine.room,
    day: tempRoutine.day,
    department: tempRoutine.deptID,
  }
  const finalRoutine = new Routine(routineInfo);
  await finalRoutine.save();
  async function loopThroughDatesWithDayOfWeek(startDate, endDate) {
    let currentDate = new Date(startDate);
  
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    while (currentDate <= new Date(endDate)) {
      const dayOfWeek = dayNames[currentDate.getDay()];
  
      // Format date as "yy-mm-dd"
      const year = String(currentDate.getFullYear());
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
      const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if necessary
  
      const formattedDate = `${year}-${month}-${day}`;
  
      // Append day of the week
      const dateWithDayOfWeek = `${formattedDate} ${dayOfWeek}`;
      const holiday = await Calendar.find({date: formattedDate});
      // console.log(formattedDate, JSON.stringify(holiday));
      if(JSON.stringify(holiday) === "[]" && dayOfWeek === finalRoutine.day){
        const scheduleInfo = {
          startTime: formatTime(start),
          endTime: formatTime(end),
          batch: tempRoutine.batch,
          section: tempRoutine.section,
          course: tempRoutine.course,
          teacher: tempRoutine.teacher,
          room: tempRoutine.room,
          day: tempRoutine.day,
          department: tempRoutine.deptID,
          date: formattedDate,
          status: "upcoming",
        }
        const finalSchedule = new Schedule(scheduleInfo);
        await finalSchedule.save();
      }
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  const startDate = '2024-05-01';
  const endDate = '2024-06-07';
  
  loopThroughDatesWithDayOfWeek(startDate, endDate);
  
  res.redirect(`./routine`);
}


exports.deleteRoutine = async (req, res) => {
  await Routine.findByIdAndDelete(req.params.id);
  //schedule needs to be delated;
  console.log("Deleted");
}

exports.updateRoutine = async (req, res) => {
  const id = req.params.id;
  const tempRoutine = req.body;
  const teacherExists = await Teacher.find({authID:tempRoutine.teacher});
  if(JSON.stringify(teacherExists) === "[]"){
    const msg = `${tempRoutine.teacher} id not found`;
    res.redirect(`.?message=${encodeURIComponent(msg)}`);
    return;
  }
  let start = tempRoutine.startTimeHours + ":" + tempRoutine.startTimeMinutes + " " + tempRoutine.startTimePeriod;
  let end = tempRoutine.endTimeHours + ":" + tempRoutine.endTimeMinutes + " " + tempRoutine.endTimePeriod;
  start = formatTime(start);
  end = formatTime(end);
  const { teacher, batch, section, room, day, deptID } = req.body;

  const results = await Routine.find({
    $or: [
      {
        $and: [
          { teacher: teacher },
          { day: day },
        ]
      },
	    {
        $and: [
          { room: room },
          { day: day },
        ]
      },
	    {
        $and: [
          { day: day },
          { department: deptID },
          {batch: batch},
          {section: section},
        ]
      },
    ]
  });

  for(const result of results){
    if(result._id != id && (isTimeBetween(start, end, result.startTime) || isTimeBetween(start, end, result.endTime))){
      const msg = "Provided time conflicts with other Datas";
      res.redirect(`.?message=${encodeURIComponent(msg)}`);
      return;
    }
  }
  const updateData = {
    day: req.body.day,
    startTime: req.body.startTimeHours + ":" + req.body.startTimeMinutes + " " + req.body.startTimePeriod,
    endTime: req.body.endTimeHours + ":" + req.body.endTimeMinutes + " " + req.body.endTimePeriod,
    batch: req.body.batch,
    section: req.body.section,
    course: req.body.course,
    teacher: req.body.teacher,
    room: req.body.room,
  };
  console.log(updateData);
  await Routine.findByIdAndUpdate(id, updateData, {new:true});
  //schedule need to be updated
  res.redirect(".");
}