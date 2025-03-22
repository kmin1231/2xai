// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate the user with username and password.
 *                  Returns a JWT token and a redirect URL based on the user's role (student, teacher, or admin).
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *                 description: The username of the user attempting to log in.
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 description: The password of the user attempting to log in.
 *     responses:
 *       200:
 *         description: Login successful, returns a redirect URL and JWT token based on user role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 redirect:
 *                   type: string
 *                   example: "/student"
 *                   description: The URL where the user will be redirected after successful login, based on their role.
 *                 token:
 *                   type: string
 *                   description: The JWT token used for authenticating further API requests.
 *       400:
 *         description: Bad request, username and password are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Username and password are required"
 *       401:
 *         description: Unauthorized, invalid username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid username or password"
 *       403:
 *         description: Forbidden, unauthorized role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized role"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 * 
 * /api/auth/protected:
 *   get:
 *     summary: Protected route
 *     description: A route that requires authentication using a valid JWT token.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successfully authenticated, returns user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This is a protected route"
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "60d5f7f8f3d2a1d944ba7c11"
 *                       description: The ID of the authenticated user.
 *                     role:
 *                       type: string
 *                       example: "student"
 *                       description: The role of the authenticated user (student, teacher, admin).
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 */

router.post('/login', login);

router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;