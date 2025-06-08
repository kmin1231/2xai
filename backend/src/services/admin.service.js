// src/services/admin.service.js

const User = require("../models/user.js");
const Class = require("../models/class.js");

const createTeacher = async ({
  username,
  password,
  name,
  school,
  className,
}) => {
  if (!username || !password || !name) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  const existing = await User.findOne({ username });
  if (existing) {
    throw new Error("이미 존재하는 교사 계정입니다.");
  }

  let classDoc = null;
  if (school && className) {
    classDoc = await Class.findOne({
      school_name: school,
      class_name: className,
    });
    if (!classDoc) {
      classDoc = await Class.create({
        school_name: school,
        class_name: className,
        class_level: "low",
        student_ids: [],
      });
    }
  }

  const teacher = new User({
    username,
    password,
    name,
    role: "teacher",
    school,
    class_id: classDoc?._id || null,
    teacher_info: {
      class_ids: classDoc ? [classDoc._id] : [],
    },
  });

  await teacher.save();

  if (classDoc) {
    classDoc.teacher = teacher._id;
    await classDoc.save();
  }

  return teacher;
};


const createStudent = async ({
  username,
  password,
  name,
  school,
  className,
  teacherUsername,
}) => {
  if (!username || !password || !name || !teacherUsername) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  const existing = await User.findOne({ username });
  if (existing) {
    throw new Error("이미 존재하는 username입니다.");
  }

  const teacherDoc = await User.findOne({
    username: teacherUsername,
    role: "teacher",
  });
  if (!teacherDoc) {
    throw new Error(
      `존재하지 않는 교사 계정입니다: '${teacherUsername}'.`,
    );
  }

  let classDoc = null;
  if (school && className) {
    classDoc = await Class.findOne({
      school_name: school,
      class_name: className,
    });
    if (!classDoc) {
      classDoc = await Class.create({
        school_name: school,
        class_name: className,
        class_level: "low",
        student_ids: [],
      });
    }
  }

  const student = new User({
    username,
    password,
    name,
    role: "student",
    school,
    class_id: classDoc?._id || null,
    teacher: teacherDoc._id,
    student_info: {
      inferred_level: "low",
      assigned_level: "low",
    },
  });

  await student.save();

  if (classDoc) {
    classDoc.student_ids.push(student._id);
    await classDoc.save();
  }

  return student;
};

module.exports = {
  createTeacher,
  createStudent,
};