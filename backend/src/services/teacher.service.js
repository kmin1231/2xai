// services/teacher.service.js

const User = require('../models/user');
const Class = require('../models/class');
const Record = require('../models/record');

const mongoose = require('mongoose');


exports.getTeacherClassList = async (teacherId) => {
  const objectId = new mongoose.Types.ObjectId(teacherId);
  return await Class.find({ teacher: objectId })
    .select('_id class_name school_name class_level')
    .lean();
};


exports.getStudentListByClass = async (classId) => {
  return await User.find({
    class_id: classId,
    role: 'student'
  })
    .select('_id username name student_info.inferred_level student_info.assigned_level')
    .lean();
};


exports.getRecordsByStudentId = async (studentId) => {
  return await Record.find({ userId: studentId }).lean();
};