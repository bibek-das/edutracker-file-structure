const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/adminController");
const authController = require("../../controllers/authentication/authController");
const store = require('../../middleware/multer');
const { isAuth, isAdmin } = require("../../middleware/auth");

router.get("/home", isAuth, isAdmin, adminController.homeView);
router.get("/manageTeacher", isAuth, isAdmin, adminController.manageTeacherView);
router.get("/academicCalendar", isAuth, isAdmin, adminController.calendarView);
router.get("/routine", isAuth, isAdmin, adminController.routineView);
router.get("/allTeachers", isAuth, isAdmin, adminController.allTeachersView);
router.get('/api/teacher/:id', isAuth, isAdmin, adminController.visitTeacherProfile);
router.post("/academicCalendar", isAuth, isAdmin, adminController.addCalendar);
router.post('/manageTeacher', isAuth, isAdmin, store.array('images', 1) , adminController.addTeacher);
router.post("/routine", isAuth, isAdmin, adminController.addRoutine);
router.delete("/routine/:id", isAuth, isAdmin, adminController.deleteRoutine);
router.post("/routine/:id", isAuth, isAdmin, adminController.updateRoutine);
router.post("/logout", isAuth, isAdmin, authController.logout);


module.exports = router;
