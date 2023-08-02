// use express router to define routes

const express = require('express');
const router = express.Router();

// import the controller
const authController = require('../controllers/Usercontroller');


// define routes
router.get('/', (_, res)=> {
    res.send('Hello world')
})
router.post('/register', authController.register);
router.post('/login', authController.login);
// router.get('/logout', authController.logout);
// router.get('/user', authController.user);

module.exports = router;