// models/record.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  textId: { type: Schema.Types.ObjectId, ref: 'Text', required: true },
  isCorrect: { type: Boolean, required: true },
}, { timestamps: true });

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;