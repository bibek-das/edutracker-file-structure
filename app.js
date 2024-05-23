const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const hbs = require("hbs");
const cron = require('node-cron');
const moment = require('moment-timezone');
const { connectMongoDB } = require("./connection");
app.use(express.json());


hbs.registerHelper('eq', function (arg1, arg2) {
  return (arg1 === arg2);
});

hbs.registerHelper('notEq', function (arg1, arg2, arg3) {
  return (arg1 != arg2) && (arg1 != arg3);
});

hbs.registerHelper('orEq', function (arg1, arg2, arg3) {
  return (arg1 === arg2) || (arg1 === arg3);
});


//route export
// const routineRoute = require("./routes/admin/routineRoute");
const addDept = require("./routes/admin/addDeptRoute");
const AuthRoute = require("./routes/authentication/authRoute");
const adminRoute = require("./routes/admin/adminRoute");
const teacherRoute = require("./routes/teacher/teacherRoute");
const PORT = 3000;

//For database connection
connectMongoDB("mongodb://localhost:27017/Edutracker");

// Create a new MongoDB session store
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/Edutracker',
  collection: 'sessions'
});

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use(bodyParser.urlencoded({ extended: true }));
// For css and js files
app.use(express.static("public"));
// For view engine
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use("/", AuthRoute);
app.use("/admin", adminRoute);
app.use("/teachers", teacherRoute);
app.use("/admin/adddept", addDept);

const Schedule = require("./models/admin/schedule");

function subtractMinutes(timeStr, minutesToSubtract) {
  // Parse the time string
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  // Convert hours to 24-hour format if necessary
  hours = parseInt(hours, 10);
  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  // Create a Date object for the current day with the parsed time
  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, milliseconds
  // Subtract the minutes
  date.setMinutes(date.getMinutes() - minutesToSubtract);
  // Get the updated hours and minutes
  let updatedHours = date.getHours();
  let updatedMinutes = date.getMinutes();
  // Determine the new AM/PM modifier
  let newModifier = updatedHours >= 12 ? 'PM' : 'AM';
  if (updatedHours === 0) {
    updatedHours = 12; // Midnight case
  } else if (updatedHours > 12) {
    updatedHours -= 12; // Convert back to 12-hour format
  }
  // Format the hours and minutes with leading zeros if necessary
  updatedHours = String(updatedHours).padStart(2, '0');
  updatedMinutes = String(updatedMinutes).padStart(2, '0');
  // Combine into the final time string
  return `${updatedHours}:${updatedMinutes} ${newModifier}`;
}



cron.schedule('* * * * *', async () => {
//   // try {
    // Get the current time in the Dhaka timezone
    const now = moment().tz('Asia/Dhaka');
    const currentTime = now.format('hh:mm A');
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const cur_date = String(date.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${cur_date}`;
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[date.getDay()];

    console.log(`Checking for class updates at ${currentTime}...`);
    // Find all classes that are scheduled to start at the current time and have the status 'upcoming'
    const updateUpcoming = await Schedule.find({ date: currentDate, day: day, startTime: currentTime, status: 'upcoming' });
    console.log(updateUpcoming);

    // Update the status of all found classes to 'ongoing'
    for (const classItem of updateUpcoming) {
      console.log(`Updating status for class: ${classItem._id}`);
      const updateData = {
        status: "ongoing",
      }
      await Schedule.findByIdAndUpdate(classItem._id, updateData, {new:true});
    }

    const updateOngoing = await Schedule.find({ date: currentDate, day: day, endTime: currentTime, status: 'ongoing' });
    console.log(updateOngoing);

    // Update the status of all found classes to 'ongoing'
    for (const classItem of updateOngoing) {
      console.log(`Updating status for class: ${classItem._id}`);
      const updateData = {
        status: "waiting",
      }
      await Schedule.findByIdAndUpdate(classItem._id, updateData, {new:true});
    }

    const originalTime = currentTime;
    const newTime = subtractMinutes(originalTime, 2);

    const updateWaiting = await Schedule.find({ date: currentDate, day: day, endTime: newTime, status: 'waiting' });
    console.log(updateWaiting);

    // Update the status of all found classes to 'Waiting'
    for (const classItem of updateWaiting) {
      console.log(`Updating status for class: ${classItem._id}`);
      const updateData = {
        status: "canceled",
      }
      await Schedule.findByIdAndUpdate(classItem._id, updateData, {new:true});
    }

});

// Setting up server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
