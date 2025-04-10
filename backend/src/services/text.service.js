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

  if (forbiddenKeywords.includes(keyword)) {
    throw new Error('금지된 키워드입니다. 다시 입력해 주세요.');
  }

  try {
    const response = await axios.post(process.env.CONTENTS_API, { keyword, level });
    const newContents = response.data;

    const { passage, question, answer, solution } = newContents;

    if (!Array.isArray(question) || question.length !== 5) {
      throw new Error('FIVE questions are required.');
    }

    if (!Array.isArray(answer) || answer.length !== 5) {
      throw new Error('FIVE answers are required.');
    }

    const newText = new Text({
      keyword,
      level,

      passage,
      question,
      answer,
      solution,
    });

    await newText.save();
    return newText;
  } catch (error) {
    console.error('Failed to call CONTENTS_API or, save text:', error.message);
    throw new Error('Failed to generate text from external API.');
  }
};


const requestGeneration3 = async (keyword, level) => {
  const forbiddenKeywords = loadForbiddenKeywordsFromJson();

  if (forbiddenKeywords.includes(keyword)) {
    throw new Error('금지된 키워드입니다. 다시 입력해 주세요.');
  }

  try {
    const requests = Array.from({ length: 3 }, () =>
      axios.post(process.env.CONTENTS_API, { keyword, level })
    );

    const responses = await Promise.all(requests);

    const savedTexts = [];

    for (const response of responses) {
      const { passage, question, answer, solution } = response.data;

      if (!Array.isArray(question) || question.length !== 5) {
        throw new Error('FIVE questions are required.');
      }

      if (!Array.isArray(answer) || answer.length !== 5) {
        throw new Error('FIVE answers are required.');
      }

      const newText = new Text({
        keyword,
        level,
        passage,
        question,
        answer,
        solution,
      });

      await newText.save();
      savedTexts.push(newText);
    }

    return savedTexts;
  } catch (error) {
    console.error('Failed to generate THREE text sets:', error.message);
    throw new Error('Failed to generate THREE text sets.');
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
  // validateKeyword,
  loadForbiddenKeywordsFromJson,
  containsForbiddenKeyword,

  requestGeneration,
  requestGeneration3,

  filterText,
  checkRecord,
  saveFeedback,
  saveHighlight,
  checkAnswer,
  saveResult,
};