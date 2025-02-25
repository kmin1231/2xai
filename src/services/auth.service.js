// services/auth.service.js

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

    console.log(`Login successful: ${username}, Role: ${user.role}`);

    return {
      success: true,
      role: user.role,
      message: 'Login successful',
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Internal server error' };
  }
};

module.exports = { loginUser };
