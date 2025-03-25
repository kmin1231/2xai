// services/teacher.service.js

const User = require('../models/user');
const Record = require('../models/record');


exports.getStudents = async (teacherId) => {
  try {
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      throw new Error('Unauthorized access');
    }

    const students = await User.find({ class: teacher.class, role: 'student' });
    return students;
  } catch (error) {
    throw new Error('Failed to get students');
  }
};


exports.getStudentRecords = async (teacherId, studentId) => {
  try {
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      throw new Error('Unauthorized access');
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      throw new Error('Student not found');
    }

    if (student.class !== teacher.class) {
      throw new Error('Student does not belong to the same class as the teacher');
    }

    const records = await Record.find({ userId: studentId }).populate('textId');
    return records;
  } catch (error) {
    throw new Error('Failed to get student records');
  }
};