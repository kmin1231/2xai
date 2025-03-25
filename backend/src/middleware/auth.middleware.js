// middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

// middleware function that validates the JWT provided in the request header
const verifyToken = (req, res, next) => {

  // check the 'Authorization' header in the incoming request
  const token = req.headers.authorization?.split(' ')[1];  // takes the actual token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. NO token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // if the token is VALID, it assigns the decoded payload (user information inside the token) to the 'req.user' object
    req.user = decoded;

    // calls 'next()' function to pass control to the NEXT middleware (or, route handler in the chain)
    next();
  } catch (error) {
    // token is INVALID or EXPIRED
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };