// models/text.js

const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  level: { type: String, required: true, enum: ['high', 'middle', 'low'] },
  title: { type: String, required: true },
  passage: { type: String, required: true },
  question: {
    type: [String],
    required: true,
    validate: [arr => arr.length === 5, 'FIVE questions required']
  },
  answer: {
    type: [String],
    required: true,
    validate: [arr => arr.length === 5, 'FIVE answers required']
  },
  solution: {
    type: [String],
    required: true,
    validate: [arr => arr.length === 5, 'FIVE solutions required']
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

const Text = mongoose.model('Text', textSchema, "texts");

module.exports = Text;