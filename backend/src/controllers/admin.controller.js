// src/controllers/admin.controller.js

const adminService = require("../services/admin.service");

// POST /api/admin/users/teachers
exports.registerTeacher = async (req, res) => {
  try {
    const teacher = await adminService.createTeacher({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      school: req.body.school,
      className: req.body.class,
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