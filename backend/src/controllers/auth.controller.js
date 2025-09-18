// auth.controller.js

const { loginUser } = require('../services/auth.service');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const result = await loginUser(username, password);

  if (!result.success) {
    return res.status(401).json({
      message: result.message,
      reason: result.reason,
    });
  }

  return res.status(200).json({
    message: 'Login successful',
    redirect: `/${result.role}`,
    token: result.token,  // return the token to the client
    role: result.role,
    name: result.name,
    classInfo: result.classInfo,
    studentLevels: result.studentLevels,  // only for student
  });
};


const logout = async (req, res) => {
  return res.json({ message: 'Logged out successfully!' });
};


module.exports = { login, logout };