// use express router to define routes

const express = require('express');
const router = express.Router();

// import the controller
const authController = require('../controllers/AuthController');


// define routes
router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.get('/logout', authController.logout);
// router.get('/user', authController.user);