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
  const records = await Record.find({ userId: studentId }).lean();

  // 점수 계산
  return records.map(record => {
    const total = record.correctness.length;
    const correct = record.correctness.filter(Boolean).length;
    const score = Math.round((correct / total) * 100);

    return {
      ...record,
      score,
      correctCount: correct,
      totalCount: total,
    };
  });
};


exports.getStudentRecordSummary = async (studentId) => {
  const records = await Record.find({ userId: studentId }).lean();

  let totalQuestions = 0;
  let totalCorrect = 0;

  records.forEach(record => {
    totalQuestions += record.correctness.length;
    totalCorrect += record.correctness.filter(Boolean).length;
  });

  const averageScore = totalQuestions === 0
    ? 0
    : Math.round((totalCorrect / totalQuestions) * 100);

  return {
    studentId,
    totalRecords: records.length,
    totalQuestions,
    totalCorrect,
    averageScore,
  };
};


exports.setStudentAssignedLevel = async (studentId, assignedLevel) => {
  const validLevels = ['high', 'middle', 'low'];
  if (!validLevels.includes(assignedLevel)) {
    throw new Error('Invalid level value');
  }

  const updatedStudent = await User.findOneAndUpdate(
    { _id: studentId, role: 'student' },
    { 'student_info.assigned_level': assignedLevel },
    { new: true }
  ).select('_id name student_info.assigned_level');

  if (!updatedStudent) {
    throw new Error('Student not found or update failed');
  }

  return updatedStudent;
};


exports.setClassAssignedLevel = async (teacherId, classId, assignedLevel) => {
  const validLevels = ['high', 'middle', 'low'];
  if (!validLevels.includes(assignedLevel)) {
    throw new Error('Invalid assigned_level value');
  }

  const teacher = await User.findOne({
    _id: teacherId,
    role: 'teacher',
    'teacher_info.class_ids': classId
  });

  if (!teacher) {
    throw new Error('Unauthorized: Teacher does not manage this class');
  }

  const result = await User.updateMany(
    { class_id: classId, role: 'student' },
    { $set: { 'student_info.assigned_level': assignedLevel } }
  );

  return result;
};


exports.setClassKeyword = async (classId, keyword) => {
  const updatedClass = await Class.findByIdAndUpdate(
    classId,
    { class_keyword: keyword },
    { new: true }
  );
  return updatedClass;
};