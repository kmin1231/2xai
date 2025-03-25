// models/highlight.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const Text = require('./text');

const highlightSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    textId: { type: Schema.Types.ObjectId, ref: 'Text', required: true },
    // start: { type: Number, required: true },
    // end: { type: Number, required: true },
    text: { type: String, required: true },
});

const Highlight = mongoose.model('Highlight', highlightSchema);

module.exports = Highlight;