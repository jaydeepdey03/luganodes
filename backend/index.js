const express = require('express');
const app = express();
const cors = require('cors')
const connectDB = require('./utils/db');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { generateNonce, SiweMessage } = require('siwe');
app.use(express.json())
require('dotenv').config()
const cookieParser = require('cookie-parser');
const verifyJwt = require('./middleware/verifyJwt');

connectDB()

app.use(morgan('dev'));
app.use(
    cors({
        origin: 'http://localhost:3000', // Replace with your frontend origin
        credentials: true,
    })
)
app.use(cookieParser());

app.use('/', require('./routes/Authroutes'));

app.get('/api/nonce', function (_, res) {
    res.setHeader('Content-Type', 'text/plain');
    const nonce = generateNonce();
    res.send(nonce);
});

app.post('/api/verify', async function (req, res) {
    const { message, signature } = req.body;
    console.log(req.body)
    const siweMessage = new SiweMessage(message);
    try {
        await siweMessage.verify({ signature });
        const accessToken = jwt.sign({ address: siweMessage.address }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000, sameSite: 'none', secure: true });
        res.status(200).json({
            ok: true,
        })
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err.message,
        })
    }
});


app.get('/api/me', verifyJwt, async (req, res) => {
    if(req.address || req.userId) return res.status(200).json(true)
    res.status(401).json(false)
})

app.get('/api/logout', async (req, res) => {
    // send the data got from the cookies back to the user
    try{
        res.clearCookie('accessToken')
        res.status(201).json({
            message: 'logged out'
        })
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})