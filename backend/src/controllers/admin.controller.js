// controllers/admin.controller.js

const Record = require('../models/record');
const Feedback = require('../models/feedback');

const adminService = require("../services/admin.service");

// POST /api/admin/users/teachers
exports.registerTeacher = async (req, res) => {
  try {
    const teacher = await adminService.createTeacher({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      school: req.body.school,
      classes: req.body.classes || [],
    });

    res.status(201).json({ message: "교사 계정 등록 성공", teacher });
  } catch (error) {
    console.error(error);
    if (error.message.includes("username")) {
      return res.status(409).json({ message: error.message });
    }
    res.status(400).json({ message: error.message || "잘못된 요청입니다." });
  }
};


// PUT /api/admin/users/teachers/:username/classes
exports.addClassesToTeacherByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { school, classes } = req.body;

    if (!school || !Array.isArray(classes) || classes.length === 0) {
      return res
        .status(400)
        .json({ message: "학교명과 학반 리스트가 필요합니다." });
    }

    const updatedTeacher = await adminService.addClassesToTeacherByUsername(
      username,
      school,
      classes,
    );

    res
      .status(200)
      .json({ message: "학반 추가 성공", teacher: updatedTeacher });
  } catch (error) {
    console.error(error);
    if (error.message.includes("존재하지 않는 교사")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("이미 다른 교사가 담당")) {
      return res.status(409).json({ message: error.message });
    }
    res.status(400).json({ message: error.message || "잘못된 요청입니다." });
  }
};


// PATCH /api/admin/users/teachers/:username/classes
exports.patchAddClassesToTeacherByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { school, classes } = req.body;

    if (!school || !Array.isArray(classes) || classes.length === 0) {
      return res.status(400).json({ message: "학교명과 학반 리스트가 필요합니다." });
    }

    const updatedTeacher = await adminService.patchAddClassesToTeacherByUsername(
      username,
      school,
      classes,
    );

    res.status(200).json({ message: "학반 추가 성공", teacher: updatedTeacher });
  } catch (error) {
    console.error(error);
    if (error.message.includes("존재하지 않는 교사")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("이미 다른 교사가 담당")) {
      return res.status(409).json({ message: error.message });
    }
    res.status(400).json({ message: error.message || "잘못된 요청입니다." });
  }
};


// POST /api/admin/users/students
exports.registerStudent = async (req, res) => {
  try {
    const students = Array.isArray(req.body) ? req.body : [req.body];

    const results = [];
    for (const studentData of students) {
      try {
        const student = await adminService.createStudent({
          username: studentData.username,
          password: studentData.password,
          name: studentData.name,
          school: studentData.school,
          className: studentData.class,
          teacherUsername: studentData.teacher,
        });
        results.push({
          username: studentData.username,
          status: "created",
          student,
        });
      } catch (error) {
        results.push({
          username: studentData.username,
          status: "failed",
          message: error.message,
        });
      }
    }

    res.status(201).json({ message: "학생 등록 성공", results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};


// GET /api/admin/classes
exports.getAllClassesController = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '관리자만 이용 가능합니다.' });
    }

    const classes = await adminService.getAllClasses();
    res.status(200).json({ message: '학반 목록 조회 성공', data: classes });
  } catch (error) {
    console.error('학반 목록 조회 중 오류 발생:', error);
    res.status(500).json({ message: '학반 목록 조회에 실패했습니다.' });
  }
};


// GET /api/admin/feedbacks
exports.getFeedbacksController = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: Only admins allowed.' });
    }

    const feedbacks = await adminService.getAllFeedbacks();

    res.status(200).json({
      message: 'Feedbacks fetched successfully',
      data: feedbacks,
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Failed to fetch feedbacks', error: error.message });
  }
};


// GET /api/admin/records/:recordId/feedback
exports.getFeedbackByRecordController = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: Only admins allowed.' });
    }

    const { recordId } = req.params;

    const record = await Record.findById(recordId).lean();
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const feedback = await Feedback.findById(record.feedbackId)
      .populate({
        path: 'userId',
        select: 'name class_id',
        populate: {
          path: 'class_id',
          model: 'Class',
          select: 'school_name class_name',
        },
      })
      .lean();

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found for this record' });
    }

    res.status(200).json({
      message: 'Feedback fetched successfully',
      data: feedback,
    });
  } catch (error) {
    console.error('Error fetching feedback by record:', error);
    res.status(500).json({ message: 'Failed to fetch feedback', error: error.message });
  }
};