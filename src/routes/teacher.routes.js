// routes/teacher.routes.js

const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');


/**
 * @swagger
 * /api/teacher/student:
 *   get:
 *     summary: Get list of students in the same class as the teacher
 *     tags: [Teacher]
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   name:
 *                     type: string
 *                   level:
 *                     type: string
 *                   class:
 *                     type: string
 *       500:
 *         description: Failed to get students
 */
router.get('/student', teacherController.getStudents);


/**
 * @swagger
 * /api/teacher/student/{id}/records:
 *   get:
 *     summary: Get learning records of a student
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: List of student records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   textId:
 *                     type: string
 *                   isCorrect:
 *                     type: boolean
 *       500:
 *         description: Failed to get student records
 */
router.get('/student/:id/records', teacherController.getStudentRecords);


module.exports = router;