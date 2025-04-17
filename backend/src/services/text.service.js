// services/text.service.js

require('dotenv').config();

const axios = require('axios');
const path = require('path');
const fs = require('fs');

const Text = require('../models/text');
const Record = require('../models/record');
const Feedback = require('../models/feedback');
const Highlight = require('../models/highlight');


const loadForbiddenKeywordsFromJson = () => {
  try {
    const filePath = path.resolve(__dirname, '../../data/badwords.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const forbiddenKeywords = JSON.parse(data);

    return forbiddenKeywords;
  } catch (error) {
    console.error('Error loading forbidden keywords from JSON:', error);
    throw new Error('Failed to load forbidden keywords.');
  }
};


const containsForbiddenKeyword = (text) => {
  const forbiddenKeywords = loadForbiddenKeywordsFromJson();
  
  return forbiddenKeywords.some(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
};


const requestGeneration = async (keyword, level) => {
  const forbiddenKeywords = loadForbiddenKeywordsFromJson();

  if (containsForbiddenKeyword(keyword, forbiddenKeywords)) {
    const error = new Error('금지어가 포함되어 있습니다.');
    error.status = 400;
    throw error;
  }

  try {
    const generations = [];

    for (let i = 0; i < 3; i++) {
      const response = await axios.post(`${process.env.CONTENTS_API}/generate/${level}`, { keyword });
      const { passage, question, answer, solution } = response.data;

      if (
        typeof passage !== 'string' ||
        !Array.isArray(question) || question.length !== 5 ||
        !Array.isArray(answer) || answer.length !== 5 ||
        !Array.isArray(solution) || solution.length !== 5
      ) {
        throw new Error(`Generation ${i + 1} format is invalid.`);
      }

      generations.push({
        passage,
        question,
        answer,
        solution
      });
    }

    return {
      keyword,
      level,
      generation0: generations[0],
      generation1: generations[1],
      generation2: generations[2]
    };
  } catch (error) {
    console.error('Error generating content:', error.message);
    throw new Error('Failed to generate content.');
  }
};


const filterText = async (keyword, level) => {
  try {
    return await Text.findOne({ keyword, level });
  } catch (error) {
    throw new Error('Failed to filter text by keyword and level.');
  }
};


const checkRecord = async (userId, textId) => {
  try {
    return await Record.findOne({ userId, textId });
  } catch (error) {
    throw new Error('Failed to check user record.');
  }
};


const saveFeedback = async (userId, textId, feedback) => {
  try {
    const newFeedback = new Feedback({ userId, textId, feedback });
    await newFeedback.save();
  } catch (error) {
    throw new Error('Failed to save feedback.');
  }
};


const saveHighlight = async (userId, textId, start, end, highlightText) => {
  try {
    const newHighlight = new Highlight({
      userId,
      textId,
      start,
      end,
      text: highlightText,
    });
    await newHighlight.save();
  } catch (error) {
    throw new Error('Failed to save highlight.');
  }
};


const checkAnswer = async (userId, textId, answer) => {
  try {
    const text = await Text.findById(textId);
    if (!text) {
      throw new Error('Text not found.');
    }

    const isCorrect = text.answer === answer;

    const newRecord = new Record({
      userId,
      textId,
      isCorrect,
    });

    await newRecord.save();

    return isCorrect;
  } catch (error) {
    throw new Error('Failed to check answer.');
  }
};


const saveResult = async (userId, textId, isCorrect) => {
  try {
    const newRecord = new Record({
      userId,
      textId,
      isCorrect,
    });

    await newRecord.save();
  } catch (error) {
    throw new Error('Failed to save learning result.');
  }
};


module.exports = {
  loadForbiddenKeywordsFromJson,
  containsForbiddenKeyword,
  requestGeneration,

  filterText,
  checkRecord,
  saveFeedback,
  saveHighlight,
  checkAnswer,
  saveResult,
};