// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true  },
  password: { type: String, required: true },
  name: { type: String },
  class: { type: String },
  school: { type: String },
  role: { type: String, required: true, enum: ['student', 'teacher', 'admin'] },
  level: { type: String, enum: ['high', 'middle', 'low'], default: 'low' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;