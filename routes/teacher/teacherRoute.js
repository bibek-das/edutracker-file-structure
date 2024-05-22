// // routes/user.js
const express = require('express');
const router = express.Router();
const teacherController = require("../../controllers/teacher/teacherController");
const authController = require("../../controllers/authentication/authController");
const { isAuth, isTeacher } = require("../../middleware/auth");

// const { ensureAuthenticated, ensureAdmin, ensureTeacher } = require('../middleware/auth');

// // Login route
router.get('/profile/:id', isAuth, isTeacher, teacherController.profileView);
router.get("/profile/classlog/:id", isAuth, isTeacher, teacherController.logView);
router.post("/logout", isAuth, isTeacher, authController.logout);


module.exports = router;
