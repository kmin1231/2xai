// services/student.service.js

const Class = require("../models/class");

const getClassInfoByStudent = async (classId) => {
  return await Class.findById(classId)
    .select("class_name school_name class_keyword")
    .lean();
};

module.exports = {
  getClassInfoByStudent,
};