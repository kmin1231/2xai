// controllers/teacher.controller.js

const teacherService = require('../services/teacher.service');


// GET /api/teacher/class-list
exports.getTeacherClassListController = async (req, res) => {
  try {
    const teacherId = req.user.userId;
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


// GET /api/teacher/students/:studentId/level
exports.setStudentAssignedLevelController = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Only teachers allowed.' });
    }

    const { studentId } = req.params;
    const { assigned_level } = req.body;

    if (!assigned_level) {
      return res.status(400).json({ message: 'assigned_level is required' });
    }

    const result = await teacherService.setStudentAssignedLevel(studentId, assigned_level);
    res.status(200).json({ message: 'Assigned level updated successfully', data: result });

  } catch (error) {
    console.error('Error updating assigned level:', error.message);
    res.status(500).json({ message: 'Failed to update assigned level', error: error.message });
  }
};


// GET /api/teacher/classes/:classId/level
exports.setClassAssignedLevelController = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Only teachers allowed.' });
    }

    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { assigned_level } = req.body;

    if (!assigned_level) {
      return res.status(400).json({ message: 'assigned_level is required' });
    }

    const result = await teacherService.setClassAssignedLevel(teacherId, classId, assigned_level);
    res.status(200).json({
      message: `All students in class ${classId} updated to '${assigned_level}'`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error in bulk level assignment:', error.message);
    res.status(500).json({ message: 'Failed to update levels', error: error.message });
  }
};


// POST /api/teacher/classes/:classId/keyword
exports.setClassKeywordController = async (req, res) => {
  try {
    const { classId } = req.params;
    const { keyword } = req.body;

    // authorization check (role-based)
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Only teachers can set class keywords.' });
    }

    const updatedClass = await teacherService.setClassKeyword(classId, keyword);

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    return res.status(200).json({
      message: 'Keyword updated successfully',
      data: updatedClass
    });
  } catch (error) {
    console.error('Error in setClassKeywordController:', error);
    return res.status(500).json({ message: 'Failed to update keyword' });
  }
};