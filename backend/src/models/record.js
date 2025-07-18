// models/record.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const recordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  textId: { type: Schema.Types.ObjectId, ref: 'Text', required: true },
  correctness: { type: [Boolean], required: true },
  userAnswer: { type: [String], required: true },
  correctAnswer: { type: [String], required: true },
  score: { type: Number, required: true },
  elapsedSeconds: { type: Number },
  mode: { type: String, enum: ['inferred', 'selected', 'assigned'], required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

const Record = mongoose.model('Record', recordSchema, "records");

module.exports = Record;