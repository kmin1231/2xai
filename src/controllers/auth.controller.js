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

  console.log(`Redirecting to /${result.role}`);

  return res.json({
    message: 'Login successful',
    redirect: `/${result.role}`,
    token: result.token,  // return the token to the client
  });
};


module.exports = { login };
