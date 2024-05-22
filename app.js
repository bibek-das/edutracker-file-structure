const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const hbs = require("hbs");
const cron = require('node-cron');
const moment = require('moment-timezone');
const { connectMongoDB } = require("./connection");


hbs.registerHelper('eq', function (arg1, arg2) {
  return (arg1 === arg2);
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
    const classesToUpdate = await Schedule.find({ date: currentDate, day: day, startTime: currentTime, status: 'upcoming' });
    console.log(classesToUpdate);

    // Update the status of all found classes to 'ongoing'
    for (const classItem of classesToUpdate) {
      console.log(`Updating status for class: ${classItem._id}`);
      const updateData = {
        status: "ongoing",
      }
      await Schedule.findByIdAndUpdate(classItem._id, updateData, {new:true});
    }
});

// Setting up server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
