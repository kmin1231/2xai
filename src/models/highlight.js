// models/highlight.js

const mongoose = require('mongoose');
const User = require('./user');
const Text = require('./text');

const highlightSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    textId: { type: mongoose.Schema.Types.ObjectId, ref: 'Text', required: true },
    // start: { type: Number, required: true },
    // end: { type: Number, required: true },
    text: { type: String, required: true },
});

const Highlight = mongoose.model('Highlight', highlightSchema);

module.exports = Highlight;