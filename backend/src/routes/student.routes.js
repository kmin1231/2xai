// routes/student.routes.js

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const { verifyToken } = require("../middleware/auth.middleware");


/**
 * @swagger
 * /api/student/class:
 *   get:
 *     summary: Get class info for the current student
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Class info fetched successfully
 *       400:
 *         description: Student is not assigned to any class
 *       403:
 *         description: Only students can access class info
 *       404:
 *         description: Class not found
 *       500:
 *         description: Failed to fetch class info
 */
router.get("/class", verifyToken, studentController.getClassInfoByStudentController);


/**
 * @swagger
 * /api/student/me:
 *   get:
 *     summary: Get current student info including level
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User info fetched successfully
 *       403:
 *         description: Only students can access this
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/me", verifyToken, studentController.getCurrentStudentInfoController);


module.exports = router;