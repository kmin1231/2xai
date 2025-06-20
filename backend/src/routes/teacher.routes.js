// routes/teacher.routes.js

const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/teacher/classes:
 *   get:
 *     summary: Get the list of classes assigned to the teacher
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6810875d2d28a6f12e544cac"
 *                   class_name:
 *                     type: string
 *                     example: "2학년 3반"
 *                   school_name:
 *                     type: string
 *                     example: "경희중학교"
 *                   class_level:
 *                     type: string
 *                     enum: [high, middle, low]
 *                     example: "low"
 *                   class_keyword:
 *                     type: string
 *                     example: "climate change"
 *       500:
 *         description: Server error
 */
router.get('/classes', verifyToken, teacherController.getTeacherClassListController);


/**
 * @swagger
 * /api/teacher/classes/{classId}/students:
 *   get:
 *     summary: Get list of students in a class
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class
 *     responses:
 *       200:
 *         description: List of students in the class
 *       400:
 *         description: classId is required
 *       500:
 *         description: Internal server error
 */
router.get('/classes/:classId/students', verifyToken, teacherController.getStudentListByClassController);


/**
* @swagger
* /api/teacher/students/{studentId}/records:
*   get:
*     summary: Get learning records for a student
*     tags: [Teacher]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: studentId
*         required: true
*         schema:
*           type: string
*         description: The ID of the student
*     responses:
*       200:
*         description: Student records fetched successfully
*       403:
*         description: Access denied
*       500:
*         description: Failed to fetch records
*/
router.get('/students/:studentId/records', verifyToken, teacherController.getRecordsByStudentIdController);


/**
 * @swagger
 * /api/teacher/students/{studentId}/records/summary:
 *   get:
 *     summary: Get summary statistics of learning records for a student
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: Student record summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student record summary fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     studentId:
 *                       type: string
 *                     totalRecords:
 *                       type: integer
 *                     totalQuestions:
 *                       type: integer
 *                     totalCorrect:
 *                       type: integer
 *                     averageScore:
 *                       type: integer
 *                       description: Percentage score (0-100)
 *       403:
 *         description: Access denied - Only teachers allowed
 *       500:
 *         description: Failed to fetch summary
 */
router.get('/students/:studentId/records/summary', verifyToken, teacherController.getStudentRecordSummaryController);


/**
 * @swagger
 * /api/teacher/students/{studentId}/records:
 *   get:
 *     summary: Get learning records and summary for a student
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: Student records and summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student records fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       textId:
 *                         type: string
 *                       correctness:
 *                         type: array
 *                         items:
 *                           type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 summary:
 *                   type: object
 *                   properties:
 *                     studentId:
 *                       type: string
 *                     totalRecords:
 *                       type: integer
 *                     totalQuestions:
 *                       type: integer
 *                     totalCorrect:
 *                       type: integer
 *                     averageScore:
 *                       type: integer
 *                       description: Percentage score (0-100)
 *       403:
 *         description: Access denied - Only teachers allowed
 *       500:
 *         description: Failed to fetch records
 */
router.get('/students/:studentId/records', verifyToken, teacherController.getRecordsByStudentIdController);


router.get('/students/:studentId/records/summary', verifyToken, teacherController.getStudentRecordSummaryController);

/**
 * @swagger
 * /api/teacher/students/{studentId}/level:
 *   post:
 *     summary: Assign a level to a specific student
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assigned_level:
 *                 type: string
 *                 example: "A2"
 *     responses:
 *       200:
 *         description: Assigned level updated successfully
 *       400:
 *         description: assigned_level is required
 *       403:
 *         description: Access denied
 *       500:
 *         description: Failed to update assigned level
 */
router.post('/students/:studentId/level', verifyToken, teacherController.setStudentAssignedLevelController);


/**
 * @swagger
 * /api/teacher/classes/{classId}/level:
 *   post:
 *     summary: Assign a level to all students in a class
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assigned_level:
 *                 type: string
 *                 example: "B1"
 *     responses:
 *       200:
 *         description: All students in class updated to the assigned level
 *       400:
 *         description: assigned_level is required
 *       403:
 *         description: Access denied
 *       500:
 *         description: Failed to update levels
 */
router.post('/classes/:classId/level', verifyToken, teacherController.setClassAssignedLevelController);


/**
 * @swagger
 * /api/teacher/classes/{classId}/keyword:
 *   post:
 *     summary: Set keyword for a class
 *     tags: [Teacher]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: "Space Exploration"
 *     responses:
 *       200:
 *         description: Keyword updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class not found
 *       500:
 *         description: Failed to update keyword
 */
router.post('/classes/:classId/keyword', verifyToken, teacherController.setClassKeywordController);


module.exports = router;