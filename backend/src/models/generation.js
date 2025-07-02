// models/generation.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const generationSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  level: {
    type: String,
    required: true,
    enum: ['low', 'middle', 'high'],
  },
  generation0: {
    title: String,
    passage: String,
    question: [String],
    answer: [String],
    solution: [String],
  },
  generation1: {
    title: String,
    passage: String,
    question: [String],
    answer: [String],
    solution: [String],
  },
  generation2: {
    title: String,
    passage: String,
    question: [String],
    answer: [String],
    solution: [String],
  },
  usedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

const Generation = mongoose.model('Generation', generationSchema, 'generations');

module.exports = Generation;