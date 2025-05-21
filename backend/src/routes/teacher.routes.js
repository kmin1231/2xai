// routes/teacher.routes.js

const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const { verifyToken } = require('../middleware/auth.middleware');


router.get('/classes', verifyToken, teacherController.getTeacherClassListController);
router.get('/classes/:classId/students', verifyToken, teacherController.getStudentListByClassController);
router.get('/students/:studentId/records', verifyToken, teacherController.getRecordsByStudentIdController);

router.post('/students/:studentId/level', verifyToken, teacherController.setStudentAssignedLevelController);
router.post('/classes/:classId/level', verifyToken, teacherController.setClassAssignedLevelController);


module.exports = router;