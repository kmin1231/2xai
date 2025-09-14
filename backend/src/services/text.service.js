// services/text.service.js

require('dotenv').config();

const axios = require('axios');
const path = require('path');
const fs = require('fs');

const User = require('../models/user');
const Text = require('../models/text');
const Record = require('../models/record');
const Feedback = require('../models/feedback');
const Highlight = require('../models/highlight');
const Keyword = require('../models/keyword');
const Generation = require('../models/generation');
const ErrorLog = require('../models/errorLog');

const { uploadImage } = require('./s3.service');
const { Buffer } = require('buffer');
const { getKstTimestamp } = require('../utils/timestamp');


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

const loadAllowedKeywordsFromJson = () => {
  try {
    const filePath = path.resolve(__dirname, '../../data/allowedwords.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const allowedKeywords = JSON.parse(data);

    return allowedKeywords;
  } catch (error) {
    console.error('Error loading allowed keywords:', error);
    return [];
  }
};


const containsForbiddenKeyword = (text) => {
  const forbiddenKeywords = loadForbiddenKeywordsFromJson();
  const allowedKeywords = loadAllowedKeywordsFromJson();
  const lowerText = text.toLowerCase();

  const cleanedText = allowedKeywords.reduce((acc, word) => {
    const regex = new RegExp(word, 'gi');
    return acc.replace(regex, '');
  }, lowerText);
  
  return forbiddenKeywords.some(keyword =>
    cleanedText.includes(keyword.toLowerCase())
  );
};


const requestGeneration = async (keyword, level, userId, type, token, userInfo = {}) => {
  const { username = 'unknown', name = 'unknown' } = userInfo;

  const timestamp = new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19);
  const forbiddenKeywords = loadForbiddenKeywordsFromJson();

  if (containsForbiddenKeyword(keyword, forbiddenKeywords)) {
    console.warn(`[금지어 입력] ${username} ${name} - keyword "${keyword}" - ${timestamp} KST`);

    const error = new Error('금지어가 포함되어 있습니다.');
    error.status = 400;
    throw error;
  }

  try {
    console.log(`[request] ${username} ${name} - keyword: ${keyword} (${level} / ${type}) - ${timestamp} KST`);

    const response = await axios.post(
      `${process.env.CONTENTS_API}/generate/${level}?type=${type}`,
      { keyword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 900000,  // 15 minutes
      }
    );

    const { generation0, generation1, generation2 } = response.data;

    console.log(`[GENERATION-START] keyword: ${keyword} (${level} / ${type}) - ${timestamp} KST`);

    // validation check
    const generations = [generation0, generation1, generation2];
    generations.forEach((gen, i) => {
      const { title, passage, question, answer, solution } = gen;

      if (
        typeof title !== 'string' || !title.trim() ||
        typeof passage !== 'string' || !passage.trim() ||
        !Array.isArray(question) || question.some(q => typeof q !== 'string' || !q.trim()) ||
        !Array.isArray(answer) || answer.some(a => typeof a !== 'string' || !a.trim()) ||
        !Array.isArray(solution) || solution.some(s => typeof s !== 'string' || !s.trim())
      ) {
        throw new Error(`Generation ${i} format is invalid.`);
      }

      console.log(`=== Generation ${i} parsed ===`, { title, passage, question, answer, solution });
    });

    console.log(`[GENERATION-END] keyword: ${keyword} (${level} / ${type}) - ${timestamp} KST`);

    return {
      keyword,
      level,
      generation0,
      generation1,
      generation2
    };
  } catch (error) {
    console.error('Error generating content:', error.message);
    throw new Error('Failed to generate content.');
  }
};


async function saveKeywordData({ keyword, level, type, user }) {
  try {
    return await Keyword.create({
      keyword,
      level,
      type,
      username: user.username || '',
      name: user.name || '',
      schoolName: user.class_id?.school_name || '',
      className: user.class_id?.class_name || '',
      userId: user._id,
    });
  } catch (error) {
    console.error('Failed to save keyword log:', error);
    return null;
  }
}


async function saveGenerationData({ keyword, level, type, user, result, keywordId }) {
  try {
    return await Generation.create({
      keyword,
      level,
      type,
      username: user.username || '',
      name: user.name || '',
      schoolName: user.class_id?.school_name || '',
      className: user.class_id?.class_name || '',
      userId: user._id,
      keywordId,
      generation0: result?.generation0,
      generation1: result?.generation1,
      generation2: result?.generation2,
    });
  } catch (error) {
    console.error('Failed to save generation data:', error);
    return null;
  }
}


const GenerationErrorTypes = {
  VALIDATION: 'ValidationError',
  TIMEOUT: 'TimeoutError',
  QUESTION_GENERATION: 'Error: Quiz generation',
  SOLUTION_GENERATION: 'Could not generate this quiz item',
  ANSWER_NA: 'N/A',
  UNEXPECTED: 'Unexpected error',
};


const GenerationErrorMessages = {
  [GenerationErrorTypes.VALIDATION]: 'ValidationError',
  [GenerationErrorTypes.TIMEOUT]: 'TimeoutError',
  [GenerationErrorTypes.QUESTION_GENERATION]: 'Question 생성 오류',
  [GenerationErrorTypes.SOLUTION_GENERATION]: 'Solution 생성 오류',
  [GenerationErrorTypes.ANSWER_NA]: 'Answer 생성 오류',
  [GenerationErrorTypes.UNEXPECTED]: 'UnexpectedError',
};


const GenerationErrorStatusCodes = {
  [GenerationErrorTypes.VALIDATION]: 422,
  [GenerationErrorTypes.TIMEOUT]: 504,
  [GenerationErrorTypes.QUESTION_GENERATION]: 500,
  [GenerationErrorTypes.SOLUTION_GENERATION]: 500,
  [GenerationErrorTypes.ANSWER_NA]: 500,
  [GenerationErrorTypes.UNEXPECTED]: 500,
};


async function saveErrorLog({ keyword, level, type, errorType, stackTrace, user }) {
  try {

    const errorMessage = GenerationErrorMessages[errorType] || '알 수 없는 오류가 발생했습니다.';

    console.log('[ERROR LOG]', { keyword, level, type, errorType, errorMessage, stackTrace, user });

    await ErrorLog.create({
      keyword,
      level,
      type,
      errorType,
      errorMessage,
      stackTrace,
      username: user.username || '',
      name: user.name || '',
      schoolName: user.class_id?.school_name || '',
      className: user.class_id?.class_name || '',
      userId: user._id,
    });
  } catch (error) {
    console.error('Failed to save error log:', error);
  }
}


function detectGenerationError(response) {
  const errorValues = Object.values(GenerationErrorTypes);

  function detectErrorInGeneration(gen) {
    function includesError(str) {
      return typeof str === 'string' && errorValues.some(err => str.includes(err));
    }
    function includesErrorExceptAnswerNA(str) {
      return typeof str === 'string' &&
        errorValues.filter(e => e !== GenerationErrorTypes.ANSWER_NA)
        .some(err => str.includes(err));
    }
    function findErrorExceptAnswerNA(str) {
      return typeof str === 'string' &&
        errorValues.filter(e => e !== GenerationErrorTypes.ANSWER_NA)
        .find(err => str.includes(err));
    }

    // title, passage, question, solution 필드에 대한 오류 검사 -- 'ANSWER_NA' type 제외
    if (includesErrorExceptAnswerNA(gen.title)) return findErrorExceptAnswerNA(gen.title);
    if (includesErrorExceptAnswerNA(gen.passage)) return findErrorExceptAnswerNA(gen.passage);

    if (Array.isArray(gen.question)) {
      for (const q of gen.question) {
        const err = findErrorExceptAnswerNA(q);
        if (err) return err;
      }
    }
    if (Array.isArray(gen.solution)) {
      for (const s of gen.solution) {
        const err = findErrorExceptAnswerNA(s);
        if (err) return err;
      }
    }

    // answer 필드에서는 'ANSWER_NA' type 포함하여 오류 검사
    if (Array.isArray(gen.answer)) {
      for (const a of gen.answer) {
        const err = errorValues.find(err => typeof a === 'string' && a.includes(err));
        if (err) return err;
      }
    }

    return null;
  }

  for (const key of ['generation0', 'generation1', 'generation2']) {
    if (response[key]) {
      const err = detectErrorInGeneration(response[key]);
      if (err) return err;
    }
  }

  return null;
}


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


const saveFeedback = async (feedbackData) => {
  try {
    const feedback = new Feedback(feedbackData);
    const result = await feedback.save();

    return result;
  } catch (error) {
    throw new Error('Error saving feedback: ' + error.message);
  }
};


const saveGeneration = async (textData) => {
  try {
    const newText = new Text(textData);
    const result = await newText.save();
    return result;
  } catch (error) {
    throw new Error('Error saving generation: ' + error.message);
  }
};


const saveHighlight = async (highlightData) => {
  try {
    const highlight = new Highlight(highlightData);
    await highlight.save();
    return highlight;
  } catch (error) {
    throw new Error('Error while saving highlight: ' + error.message);
  }
};

const deleteHighlight = async (userId, id) => {
  try {
    const result = await Highlight.findOneAndDelete({ _id: id, userId });
    return result;
  } catch (error) {
    throw new Error('Error while deleting highlight: ' + error.message);
  }
};


const uploadHighlightImage = async ({ userId, base64Image, highlightIds, textId }) => {

  // base64 -> buffer
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image data');
  }
  const contentType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  // S3 bucket upload
  const key = `${getKstTimestamp()}-${userId}.png`;
  const imageUrl = await uploadImage(buffer, key, contentType);

  // update database
  await Highlight.updateMany(
    { _id: { $in: highlightIds }, userId },
    { $set: { imageUrl } }
  );

  await Text.findByIdAndUpdate(
    textId,
    { $addToSet: { highlightIds: { $each: highlightIds } } }
  );

  return imageUrl;
};


const updateLevel = async (userId, score, mode) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const currentLevel = user.student_info?.inferred_level || 'low';

  if (mode !== 'inferred') {
    return currentLevel;
  }

  let newLevel = currentLevel;

  const correctCount = score;

  // update 'inferred_level' based on performance 
  if (!user.student_info || !user.student_info.inferred_level) {
    if (correctCount === 5) newLevel = 'high';
    else if (correctCount >= 2) newLevel = 'middle';
    else newLevel = 'low';
  } else if (currentLevel === 'high') {
    newLevel = correctCount >= 3 ? 'high' : 'middle';
  } else if (currentLevel === 'middle') {
    if (correctCount === 5) newLevel = 'high';
    else if (correctCount <= 1) newLevel = 'low';
    else newLevel = 'middle';
  } else if (currentLevel === 'low') {
    newLevel = correctCount >= 4 ? 'middle' : 'low';
  }

  // update user info
  if (newLevel !== currentLevel) {
    user.student_info.inferred_level = newLevel;
    await user.save();
  }

  return newLevel;
};


const checkAnswer = (userAnswerIndexArray, correctAnswerArray) => {
  const optionLabels = ['a', 'b', 'c', 'd', 'e'];

  const userAnswerStrArray = userAnswerIndexArray.map(index => optionLabels[index] || '-');
  const correctnessArray = userAnswerStrArray.map((ans, idx) => {
    const correctAns = correctAnswerArray[idx];
    return ans.toLowerCase() === (correctAns || '').toLowerCase();
  });

  return {
    userAnswer: userAnswerStrArray,
    correctness: correctnessArray,
  };
};


const getRecordsByUser = async (userId) => {
  try {
    const records = await Record.find({ userId });
    return records;
  } catch (error) {
    throw new Error('Error while fetching records: ' + error.message);
  }
};

const getTextById = async (textId) => {
  try {
    const text = await Text.findById(textId).lean();
    if (!text) {
      throw new Error('Text not found');
    }
    return text;
  } catch (error) {
    throw new Error('Error while fetching text: ' + error.message);
  }
};


module.exports = {
  loadForbiddenKeywordsFromJson,
  containsForbiddenKeyword,
  requestGeneration,
  saveKeywordData,
  saveGenerationData,
  GenerationErrorTypes,
  GenerationErrorMessages,
  GenerationErrorStatusCodes,
  saveErrorLog,
  detectGenerationError,
  testConnection,
  saveFeedback,
  saveGeneration,
  saveHighlight,
  deleteHighlight,
  uploadHighlightImage,
  updateLevel,
  checkAnswer,
  getRecordsByUser,
  getTextById,
};