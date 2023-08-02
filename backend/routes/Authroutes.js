// use express router to define routes

const express = require('express');
const router = express.Router();

// import the controller
const authController = require('../controllers/Usercontroller');


// define routes
router.get('/', (_, res) => {
    res.send('Hello world')
})
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', async (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(200).json({ message: 'User is already logged out' });
    }
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'none', secure: true });
    res.status(200).json({ message: 'Logged out successfully' });
  });
  

module.exports = router;