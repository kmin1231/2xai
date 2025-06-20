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
 *               - classes
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


// PUT /api/admin/users/teachers/:username/classes
/**
 * @swagger
 * /api/admin/users/teachers/{username}/classes:
 *   put:
 *     summary: Add classes to an existing teacher by username
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         description: Teacher's username
 *         required: true
 *         schema:
 *           type: string
 *           example: teacherid
 *     requestBody:
 *       description: Classes to add for the teacher
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school
 *               - classes
 *             properties:
 *               school:
 *                 type: string
 *                 example: 경희중학교
 *               classes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - className
 *                   properties:
 *                     className:
 *                       type: string
 *                       example: 1학년 1반
 *     responses:
 *       200:
 *         description: Classes successfully added to the teacher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 학반이 성공적으로 추가되었습니다.
 *                 teacher:
 *                   type: object
 *                   description: Updated teacher object
 *       400:
 *         description: Invalid input or teacher not found
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
router.put("/users/teachers/:username/classes", verifyToken, adminController.addClassesToTeacherByUsername);


// PATCH /api/admin/users/teachers/:username/classes
/**
 * @swagger
 * /api/admin/users/teachers/{username}/classes:
 *   patch:
 *     summary: Add new classes to an existing teacher by username (preserve existing classes)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         description: Teacher's username
 *         required: true
 *         schema:
 *           type: string
 *           example: teacherid
 *     requestBody:
 *       description: New classes to append for the teacher
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - school
 *               - classes
 *             properties:
 *               school:
 *                 type: string
 *                 example: 경희중학교
 *               classes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - className
 *                   properties:
 *                     className:
 *                       type: string
 *                       example: 2학년 3반
 *     responses:
 *       200:
 *         description: New classes successfully added (existing classes preserved)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 학반 추가 성공
 *                 teacher:
 *                   type: object
 *                   description: Updated teacher object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       404:
 *         description: Teacher not found
 *       409:
 *         description: One or more classes are already assigned to another teacher
 *       500:
 *         description: Server error
 */
router.patch("/users/teachers/:username/classes", verifyToken, adminController.patchAddClassesToTeacherByUsername);


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