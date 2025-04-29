// models/feedback.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, },
  keyword: { type: String, required: true, },
  level: { type: String, required: true, },
  feedbacks: [{
    title: { type: String, required: true, },
    passage: { type: String, required: true, },
    feedback: { type: String, required: true, enum: ['good', 'too_easy', 'too_hard', 'not_interesting'], },
  }],
});

const Feedback = mongoose.model('Feedback', feedbackSchema, "feedbacks");

module.exports = Feedback;