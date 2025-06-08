// routes/admin.routes.js

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken } = require("../middleware/auth.middleware");


// POST /api/admin/users/teachers
/**
 * @swagger
 * /api/admin/users/teachers:
 *   post:
 *     summary: Register a new teacher
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Teacher registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *               - school
 *               - class
 *             properties:
 *               username:
 *                 type: string
 *                 example: teacherid
 *               password:
 *                 type: string
 *                 example: teacherpw
 *               name:
 *                 type: string
 *                 example: 이경희 선생님
 *               school:
 *                 type: string
 *                 example: 경희중학교
 *               class:
 *                 type: string
 *                 example: 2학년 3반
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Invalid input or teacher already exists
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.post("/users/teachers", verifyToken, adminController.registerTeacher);


// POST /api/admin/users/students
/**
 * @swagger
 * /api/admin/users/students:
 *   post:
 *     summary: Register a new student
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Student registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *               - role
 *               - school
 *               - class
 *               - teacher
 *             properties:
 *               username:
 *                 type: string
 *                 example: studentid
 *               password:
 *                 type: string
 *                 example: studentpw
 *               name:
 *                 type: string
 *                 example: 김경희
 *               role:
 *                 type: string
 *                 enum: [student]
 *                 example: student
 *               school:
 *                 type: string
 *                 example: 경희중학교
 *               class:
 *                 type: string
 *                 example: 2학년 3반
 *               teacher:
 *                 type: string
 *                 example: teacherid
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Invalid input or student already exists
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.post("/users/students", verifyToken, adminController.registerStudent);


module.exports = router;