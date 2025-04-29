// services/auth.service.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const User = require('../models/user');
const Class = require('../models/class');

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username })
      .populate('class_id');

    // console.log('User class_id:', user.class_id);

    if (!user) {
      console.log('Login failed: User not found');
      return { success: false, message: 'Invalid username or password' };
    }

    if (user.password !== password) {
      console.log('Login failed: Incorrect password');
      return { success: false, message: 'Invalid username or password' };
    }
    
    console.log(`Login Success: [${user.role}] ${username}`);

    // information to be included in the token
    let payload = {
      userId: user._id,
      role: user.role,
      classId: user.class_id?._id || null,
    };

    // add additional information based on user role (User.role = student)
    if (user.role === 'student') {
      payload.inferredLevel = user.student_info.inferred_level;
      payload.assignedLevel = user.student_info.assigned_level;
    }

    // issue the token from the server
    const token = jwt.sign(
      payload,
      SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
      success: true,
      role: user.role,
      name: user.name,
      classInfo: user.class_id ? {
        className: user.class_id.class_name,
        schoolName: user.class_id.school_name,
      } : null,
      studentLevels: user.role === 'student' ? {
        inferredLevel: user.student_info?.inferred_level || 'low',
        assignedLevel: user.student_info?.assigned_level || 'low',
      } : null,
      message: 'Login successful',
      token,  // token to be delivered to the client
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Internal server error' };
  }
};

module.exports = { loginUser };