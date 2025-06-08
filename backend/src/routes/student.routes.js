// routes/student.routes.js

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const { verifyToken } = require("../middleware/auth.middleware");


/**
 * @swagger
 * /api/student/class-info:
 *   get:
 *     summary: Get class info for the current student
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
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
router.get(
  "/class-info",
  verifyToken,
  studentController.getClassInfoByStudentController,
);

module.exports = router;