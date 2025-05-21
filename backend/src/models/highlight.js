// models/highlight.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const highlightSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

const Highlight = mongoose.model('Highlight', highlightSchema, "highlights");

module.exports = Highlight;