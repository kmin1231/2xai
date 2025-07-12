// models/generation.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const generationContentSchema = new Schema(
  {
    title: { type: String, required: true },
    passage: { type: String, required: true },
    question: [{ type: String, required: true }],
    answer: [{ type: String, required: true }],
    solution: [{ type: String, required: true }],
  },
  { _id: false },
);

const generationSchema = new Schema({
    username: { type: String },
    name: { type: String },
    schoolName: { type: String },
    className: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    keywordId: { type: Schema.Types.ObjectId, ref: "Keyword" },

    keyword: { type: String, required: true },
    level: { type: String, enum: ["high", "middle", "low"], required: true },
    type: {
      type: String,
      enum: ["inferred", "assigned", "selected"],
      required: true,
    },

    generation0: { type: generationContentSchema, required: true },
    generation1: { type: generationContentSchema, required: true },
    generation2: { type: generationContentSchema, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

const Generation = mongoose.model("Generation", generationSchema, "generations");

module.exports = Generation;