// models/errorLog.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const errorLogSchema = new mongoose.Schema({
  keyword: { type: String },
  level: { type: String, enum: ['high', 'middle', 'low'] },
  type: { type: String, enum: ['inferred', 'assigned', 'selected'] },
  errorType: { type: String },
  errorMessage: { type: String },
  stackTrace: { type: String },

  username: { type: String },
  schoolName: { type: String },
  className: { type: String },
  name: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },

  timestamp: { type: Date, default: Date.now },
}, {
  versionKey: false
});

module.exports = mongoose.model('ErrorLog', errorLogSchema, 'errorlogs');