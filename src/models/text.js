// models/text.js

const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  level: { type: String, required: true, enum: ['high', 'normal', 'easy'] },
  passage: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  solution: { type: String, required: true },
});

const Text = mongoose.model('Text', textSchema);

module.exports = Text;