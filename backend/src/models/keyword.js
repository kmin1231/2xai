// models/keyword.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const keywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  level: { type: String, enum: ['high', 'middle', 'low'], required: true },
  type: { type: String, enum: ['inferred', 'assigned', 'selected'], required: true },

  username: { type: String },
  name: { type: String },
  schoolName: { type: String },
  className: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },

  createdAt: { type: Date, default: Date.now },
}, {
  versionKey: false,
});

module.exports = mongoose.model('Keyword', keywordSchema, 'keywords');