// controllers/student.controller.js

const studentService = require("../services/student.service");

const User = require("../models/user");
const Record = require("../models/record");


// GET /api/text/class-info
exports.getClassInfoByStudentController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user || user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can access class info." });
    }

    if (!user.class_id) {
      return res
        .status(400)
        .json({ message: "Student is not assigned to any class." });
    }

    const classInfo = await studentService.getClassInfoByStudent(user.class_id);

    if (!classInfo) {
      return res.status(404).json({ message: "Class info not found." });
    }

    return res.status(200).json({
      message: "Class info fetched successfully",
      data: classInfo,
    });
  } catch (error) {
    console.error("Error in getClassInfoByStudentController:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch class info", error: error.message });
  }
};