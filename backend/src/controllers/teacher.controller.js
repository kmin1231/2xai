// controllers/teacher.controller.js

const teacherService = require('../services/teacher.service');


// GET /api/teacher/class-list
exports.getTeacherClassListController = async (req, res) => {
  try {
    const teacherId = req.user.userId;  // verifyToken에서 저장된 정보 사용
    const classes = await teacherService.getTeacherClassList(teacherId);
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// GET /api/classes/:classId/students
exports.getStudentListByClassController = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ message: 'classId is required' });
    }

    const students = await teacherService.getStudentListByClass(classId);
    res.json(students);
  } catch (error) {
    console.error('Error in getStudentListByClassController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET /api/teacher/students/:studentId/records
exports.getRecordsByStudentIdController = async (req, res) => {
  try {
    const { studentId } = req.params;

    // authorization check (role-based)
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: Only teachers allowed.' });
    }

    const records = await teacherService.getRecordsByStudentId(studentId);
    res.status(200).json({ message: 'Student records fetched successfully', data: records });
  } catch (error) {
    console.error('Error fetching student records:', error.message);
    res.status(500).json({ message: 'Failed to fetch records', error: error.message });
  }
};