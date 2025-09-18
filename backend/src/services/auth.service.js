// services/auth.service.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const User = require('../models/user');
const Class = require('../models/class');

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username })
      .populate('class_id')
      .populate('teacher_info.class_ids');

    // console.log('User class_id:', user.class_id);

    if (!user) {
      console.log(`[Login FAILED] User not found - username: ${username}`);
      return { success: false, reason: 'no_user', message: 'User not found' };
    }

    if (user.password !== password) {
      console.log(`[Login FAILED] Incorrect password - username: ${username} / password: ${password}`);
      return { success: false, reason: 'wrong_password', message: 'Incorrect password' };
    }
    
    console.log(`[Login Success] ${username} (${user.role})`);

    // information to be included in the token
    const payload = {
      userId: user._id,
      role: user.role,
      classId: user.class_id?._id || null,
    };

    // add additional information based on user role (User.role = student)
    let studentLevels = null;
    if (user.role === 'student') {
      payload.inferredLevel = user.student_info.inferred_level;
      payload.assignedLevel = user.student_info.assigned_level;

      studentLevels = {
        inferredLevel: user.student_info?.inferred_level || 'low',
        assignedLevel: user.student_info?.assigned_level || 'low',
      };
    }

    // issue the token from the server
    const token = jwt.sign(
      payload,
      SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // common response fields
    const response = {
      success: true,
      message: 'Login successful',
      token,  // token to be delivered to the client
      role: user.role,
      name: user.name,
      studentLevels,
      classInfo: null,
      teacherClasses: null,
    };

    if (user.role === 'student' && user.class_id) {
      response.classInfo = {
        className: user.class_id.class_name,
        schoolName: user.class_id.school_name,
      };
    }
    
    if (user.role === 'teacher') {
      response.teacherClasses = user.teacher_info?.class_ids?.map(cls => ({
        classId: cls._id,
        className: cls.class_name,
        schoolName: cls.school_name,
      })) || [];

      // TeacherHeader에 표시할 학교명
      response.classInfo = {
        schoolName: response.teacherClasses.length > 0
          ? response.teacherClasses[0].schoolName
          : '',
      };
    }

    if (user.role === 'admin') {
      response.classInfo = {
        schoolName: '2xAI',
      };
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, reason: 'server_error', message: 'Internal server error' };
  }
};

module.exports = { loginUser };