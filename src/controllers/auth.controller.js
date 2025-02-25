// auth.controller.js

const { loginUser } = require('../services/auth.service');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const result = await loginUser(username, password);

  if (!result.success) {
    return res.status(401).json({ message: result.message });
  }

  if (result.role === 'student') {
    console.log('Redirecting to /student');
    return res.json({ message: 'Login successful', redirect: '/student' });
  } else if (result.role === 'teacher') {
    console.log('Redirecting to /teacher');
    return res.json({ message: 'Login successful', redirect: '/teacher' });
  } else if (result.role === 'admin') {
    console.log('Redirecting to /admin');
    return res.json({ message: 'Login successful', redirect: '/admin' });
  } else {
    return res.status(403).json({ message: 'Unauthorized role' });
  }
};

module.exports = { login };
