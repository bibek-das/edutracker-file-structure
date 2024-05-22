// // routes/user.js
const express = require('express');
const router = express.Router();
const AuthController = require("../../controllers/authentication/authController");

// const { ensureAuthenticated, ensureAdmin, ensureTeacher } = require('../middleware/auth');

// // Login route
router.get('', AuthController.loginView);
router.post('', AuthController.login);


module.exports = router;
