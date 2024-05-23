// // routes/user.js
const express = require('express');
const router = express.Router();
const teacherController = require("../../controllers/teacher/teacherController");
const authController = require("../../controllers/authentication/authController");
const { isAuth, isTeacher, authenticatedTeacher } = require("../../middleware/auth");

// const { ensureAuthenticated, ensureAdmin, ensureTeacher } = require('../middleware/auth');

// // Login route
router.get('/profile/:id', isAuth, isTeacher, authenticatedTeacher, teacherController.profileView);
router.get("/profile/classlog/:id", isAuth, isTeacher, authenticatedTeacher, teacherController.logView);
router.post("/profile/classlog/:id", isAuth, isTeacher, teacherController.markAttended);
router.post("/profile/classlog/cancel/:id", isAuth, isTeacher, teacherController.cancelClass);
router.post("/logout", isAuth, isTeacher, authController.logout);


module.exports = router;
