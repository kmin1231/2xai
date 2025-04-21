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


const requestGeneration = async (keyword, level, token) => {
  const forbiddenKeywords = loadForbiddenKeywordsFromJson();

  if (containsForbiddenKeyword(keyword, forbiddenKeywords)) {
    const error = new Error('금지어가 포함되어 있습니다.');
    error.status = 400;
    throw error;
  }

  try {
    console.log('Requesting generation for keyword:', keyword);
    console.log('Requesting generation for level:', level);

    const generations = [];

    for (let i = 0; i < 3; i++) {
      const response = await axios.post(
        `${process.env.CONTENTS_API}/generate/${level}`,
        { keyword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const generationData = response.data[`generation${i}`];

            if (!generationData) {
              throw new Error(`Generation ${i} data is missing.`);
            }
      
            const { title, passage, question, answer, solution } = generationData;

      // console.log(`=== Generation ${i} Response ===`);
      console.log('=== Generation', i, 'parsed ===', { title, passage, question, answer, solution });
      // console.log(JSON.stringify(response.data, null, 2));

      if (
        typeof title !== 'string' || !title.trim() ||
        typeof passage !== 'string' || !passage.trim() ||
        !Array.isArray(question) || question.some(q => typeof q !== 'string' || !q.trim()) ||
        !Array.isArray(answer) || answer.some(a => typeof a !== 'string' || !a.trim()) ||
        !Array.isArray(solution) || solution.some(s => typeof s !== 'string' || !s.trim())
      ) {
        throw new Error(`Generation ${i} format is invalid.`);
      }

      generations.push({
        title,
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


const testConnection = async () => {
  try {
    const response = await axios.get(`${process.env.CONTENTS_API}/`);
    
    if (response.status === 200) {
      console.log('Request sent successfully to FastAPI server.');
      return {
        success: true,
        message: 'FastAPI server is reachable.',
        data: response.data
      };
    } else {
      console.error('FastAPI server responded with non-200 status:', response.status);
      return {
        success: false,
        message: `Unexpected status code from FastAPI server: ${response.status}`
      };
    }
  } catch (error) {
    console.error('Failed to connect to FastAPI server:', error.message);
    return {
      success: false,
      message: 'Failed to reach FastAPI server.',
      error: error.message
    };
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
  testConnection,

  filterText,
  checkRecord,
  saveFeedback,
  saveHighlight,
  checkAnswer,
  saveResult,
};