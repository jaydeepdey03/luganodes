const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'your_secret_key_here';

function verifyJwt(req, res, next) {
    
  const accessToken = req.header('Authorization');
  if (!accessToken) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  try {
    const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid access token' });
  }
}

module.exports = verifyJwt;
