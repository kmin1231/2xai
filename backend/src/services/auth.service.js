// services/auth.service.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const User = require('../models/user');

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      console.log('Login failed: User not found');
      return { success: false, message: 'Invalid username or password' };
    }

    if (user.password !== password) {
      console.log('Login failed: Incorrect password');
      return { success: false, message: 'Invalid username or password' };
    }
    
    console.log(`Login Success: [${user.role}] ${username}`);

    // issue the token from the server
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
      success: true,
      role: user.role,
      school: user.school,
      name: user.name,
      message: 'Login successful',
      token,  // token to be delivered to the client
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Internal server error' };
  }
};

module.exports = { loginUser };