// models/feedback.js

const mongoose = require('mongoose');
const User = require('./user');
const Text = require('./text');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  textId: { type: mongoose.Schema.Types.ObjectId, ref: 'Text', required: true },
  feedback: {
    type: String,
    enum: ['easy', 'hard', 'boring'],
    required: true,
  },
});


feedbackSchema.pre('save', async function (next) {
  const user = await User.findById(this.userId);
  const text = await Text.findById(this.textId);

  this.userName = user ? user.name : null;
  this.textPassage = text ? text.passage : null;

  next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;