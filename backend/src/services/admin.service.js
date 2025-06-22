// services/admin.service.js

const User = require("../models/user");
const Class = require("../models/class");
const Feedback = require('../models/feedback');

exports.createTeacher = async ({
  username,
  password,
  name,
  school,
  classes = [],
}) => {
  if (!username || !password || !name) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  const existing = await User.findOne({ username });
  if (existing) {
    throw new Error("이미 존재하는 교사 계정입니다.");
  }

  const classIds = [];

  for (const { className } of classes) {
    if (!className) continue;

    let classDoc = await Class.findOne({
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

    classIds.push(classDoc._id);
  }

  const teacher = new User({
    username,
    password,
    name,
    role: "teacher",
    school,
    class_id: classIds.length > 0 ? classIds[0] : null, // default class_id
    teacher_info: {
      class_ids: classIds,
    },
  });

  await teacher.save();

  await Class.updateMany(
    { _id: { $in: classIds } },
    { $set: { teacher: teacher._id } },
  );

  return teacher;
};


exports.addClassesToTeacherByUsername = async (
  username,
  school,
  classes = [],
) => {
  if (!username || !school || classes.length === 0) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  const teacher = await User.findOne({ username });
  if (!teacher || teacher.role !== "teacher") {
    throw new Error("존재하지 않는 교사 계정입니다.");
  }

  const existingClassIds = teacher.teacher_info?.class_ids || [];
  const newClassIds = [];

  for (const { className } of classes) {
    if (!className) continue;

    let classDoc = await Class.findOne({
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

    if (classDoc.teacher && !classDoc.teacher.equals(teacher._id)) {
      throw new Error(`"이미 존재하는 학반입니다.`);
    }

    if (!classDoc.teacher || !classDoc.teacher.equals(teacher._id)) {
      classDoc.teacher = teacher._id;
      await classDoc.save();
    }

    if (!existingClassIds.some((id) => id.equals(classDoc._id))) {
      newClassIds.push(classDoc._id);
    }
  }

  teacher.teacher_info.class_ids = [...existingClassIds, ...newClassIds];

  if (teacher.teacher_info.class_ids.length > 0 && !teacher.class_id) {
    teacher.class_id = teacher.teacher_info.class_ids[0];
  }

  await teacher.save();

  return teacher;
};


exports.patchAddClassesToTeacherByUsername = async (username, school, classes = []) => {
  if (!username || !school || classes.length === 0) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  const teacher = await User.findOne({ username });
  if (!teacher || teacher.role !== "teacher") {
    throw new Error("존재하지 않는 교사 계정입니다.");
  }

  const existingClassIds = teacher.teacher_info?.class_ids || [];
  const newClassIds = [];

  for (const { className } of classes) {
    if (!className) continue;

    let classDoc = await Class.findOne({
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

    if (classDoc.teacher && !classDoc.teacher.equals(teacher._id)) {
      throw new Error(`이미 다른 교사가 담당 중인 학반입니다: ${className}`);
    }

    if (!classDoc.teacher || !classDoc.teacher.equals(teacher._id)) {
      classDoc.teacher = teacher._id;
      await classDoc.save();
    }

    if (!existingClassIds.some((id) => id.equals(classDoc._id))) {
      newClassIds.push(classDoc._id);
    }
  }

  teacher.teacher_info.class_ids = [...existingClassIds, ...newClassIds];

  if (teacher.teacher_info.class_ids.length > 0 && !teacher.class_id) {
    teacher.class_id = teacher.teacher_info.class_ids[0];
  }

  await teacher.save();

  return teacher;
};


exports.createStudent = async ({
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
    throw new Error(`존재하지 않는 교사 계정입니다: '${teacherUsername}'.`);
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


exports.getAllClasses = async () => {
  return await Class.find()
    .select('_id class_name school_name class_level class_keyword teacher')
    .lean();
};


exports.getAllFeedbacks = async () => {
  const feedbacks = await Feedback.find()
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

  return feedbacks;
};