// models/highlight.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const highlightSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },

    label: {
      type: String,
      enum: ['important', 'confusing', 'mainidea', 'etc'],
      default: 'etc',
      required: true,
    },

    imageUrl: {
      type: String,
      required: false,
    },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

const Highlight = mongoose.model('Highlight', highlightSchema, "highlights");

module.exports = Highlight;