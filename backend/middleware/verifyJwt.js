const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'your_secret_key_here';

function verifyJwt(req, res, next) {

  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    // decodedToken can be userId or wallet address
    console.log(decodedToken, 'decodedtoken')
    if (decodedToken.userId) req.userId = decodedToken.userId;
    if (decodedToken.address) req.address = decodedToken.address;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid access token' });
  }
}

module.exports = verifyJwt;
