// model/class.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const classSchema = new mongoose.Schema({
    class_name: { type: String },
    school_name: { type: String },
    teacher: { type: Schema.Types.ObjectId, ref: 'User' },                          // 담당 교사 (User.role = teacher)
    student_ids: [{ type: Schema.Types.ObjectId, ref: 'User' }],                    // 소속 학생들의 목록 (User.role = student)
    class_level: { type: String, enum: ['high', 'middle', 'low'], default: 'low' }, // 담당 교사가 지정한 level
    class_keyword: { type: String }                                                 // 담당 교사가 지정한 keyword
}, {
    timestamps: true,
    versionKey: false
});

const Class = mongoose.model('Class', classSchema, 'classes');

module.exports = Class;