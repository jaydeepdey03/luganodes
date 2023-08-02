const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Usermodal');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const accessToken = req.cookies.accessToken;
      if (accessToken) {
        return res.status(200).json({ message: 'User is already logged in' });
      }
  
      const newAccessToken = jwt.sign({ userId: user._id.toString() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 });
  
      res.json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  
  
module.exports = {
    register,
    login,
}