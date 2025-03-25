// controllers/teacher.controller.js

const teacherService = require('../services/teacher.service');


// GET /api/teacher/student
exports.getStudents = async (req, res) => {
  const { teacherId } = req.user;

  try {
    const students = await teacherService.getStudents(teacherId);
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get students', error });
  }
};


// GET /api/teacher/student/:id/records
exports.getStudentRecords = async (req, res) => {
  const { teacherId } = req.user;
  const { id } = req.params;

  try {
    const records = await teacherService.getStudentRecords(teacherId, id);
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get student records', error });
  }
};