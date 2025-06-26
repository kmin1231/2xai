// services/student.service.js

const Class = require("../models/class");
const User = require("../models/user");

const getClassInfoByStudent = async (classId) => {
  return await Class.findById(classId)
    .select("class_name school_name class_keyword")
    .lean();
};


const getCurrentStudentInfo = async (userId) => {
  const user = await User.findById(userId).populate("class_id");

  if (!user || user.role !== "student") return null;

  return {
    name: user.name,
    role: user.role,
    studentLevels: {
      inferredLevel: user.student_info?.inferred_level || "low",
      assignedLevel: user.student_info?.assigned_level || "low",
    },
    classInfo: {
      schoolName: user.class_id?.school_name || "",
      className: user.class_id?.class_name || "",
    },
  };
};


module.exports = {
  getClassInfoByStudent,
  getCurrentStudentInfo,
};