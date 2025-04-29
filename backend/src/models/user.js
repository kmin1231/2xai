// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true  },
  password: { type: String, required: true },
  name: { type: String },
  class: { type: String },
  school: { type: String },
  class_id: { type: Schema.Types.ObjectId, ref: 'Class' },
  role: { type: String, required: true, enum: ['student', 'teacher', 'admin'] },
  level: { type: String, enum: ['high', 'middle', 'low'], default: 'low' },

  student_info: {
    inferred_level: { type: String, enum: ['high', 'middle', 'low'] },  // 알고리즘에 의한 level
    assigned_level: { type: String, enum: ['high', 'middle', 'low'] },  // 교사 지정 level
  },

  teacher_info: {
    class_ids: [{ type: Schema.Types.ObjectId, ref: 'Class' }]
  }

}, {
  timestamps: true,
  versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;