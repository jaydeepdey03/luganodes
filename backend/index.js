const express = require('express');
const app = express();
const cors = require('cors')
const connectDb = require('./utils/db');
const connectDB = require('./utils/db');
const morgan = require('morgan');
const { generateNonce, SiweMessage } = require('siwe');
app.use(cors())
app.use(express())
require('dotenv').config()

connectDB()

app.use(morgan('dev'));

app.get('/nonce', function (_, res) {
    res.setHeader('Content-Type', 'text/plain');
    const nonce = generateNonce();
    res.cookie('nonce', nonce, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.send(nonce);
});

app.post('/verify', async function (req, res) {
    const { message, signature } = req.body;
    const siweMessage = new SiweMessage(message);
    try {
        await siweMessage.verify({ signature });
        res.send(true);
    } catch {
        res.send(false);
    }
});


app.get('/me', async(req, res)=> {
    // send the data got from the cookies back to the user
    res.send(req.cookies.siwe?.address)
})

app.get('/logout', async(req, res)=> {
    // send the data got from the cookies back to the user
    res.clearCookie('siwe')
    res.send('Logged out')
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})