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
const Generation = require('../models/generation');

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


const containsForbiddenKeyword = (text) => {
  const forbiddenKeywords = loadForbiddenKeywordsFromJson();
  
  return forbiddenKeywords.some(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
};


function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


const requestGeneration = async (keyword, level, type, token) => {
  const forbiddenKeywords = loadForbiddenKeywordsFromJson();

  if (containsForbiddenKeyword(keyword, forbiddenKeywords)) {
    const error = new Error('금지어가 포함되어 있습니다.');
    error.status = 400;
    throw error;
  }

  try {
    console.log('Requesting generation for keyword:', keyword);
    console.log('Requesting generation for level:', level);
    console.log('Requesting generation for type:', type);

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


async function findUnusedGenerationOrCreate(keyword, level, userId, type, token) {
  const candidates = await Generation.find({ keyword, level });

  const shuffled = shuffleArray(candidates);

  const unused = shuffled.find(gen => !gen.usedBy.includes(userId));

  if (unused) {
    unused.usedBy.push(userId);
    await unused.save();

    return unused;
  }

  // 생성 요청
  const newGenerationData = await requestGeneration(keyword, level, type, token);

  const newGenDoc = new Generation({
    ...newGenerationData,
    usedBy: [userId],
  });
  await newGenDoc.save();

  return newGenDoc;
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


const generateFeedbackData = (keyword, level, feedbacks) => {

  console.log('Feedbacks:', feedbacks);

  const feedbackData = {
    keyword: keyword,
    level: level,
    feedbacks,
  };
  return feedbackData;
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

const deleteHighlight = async (userId, text) => {
  try {
    const result = await Highlight.findOneAndDelete({ userId, text });
    return result;
  } catch (error) {
    throw new Error('Error while deleting highlight: ' + error.message);
  }
};


const uploadHighlightImage = async ({ userId, base64Image, highlightIds }) => {

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

  return imageUrl;
};


const updateLevel = async (userId, score) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const currentLevel = user.student_info?.inferred_level || 'low';

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
  const correctnessArray = userAnswerStrArray.map((ans, idx) => ans === correctAnswerArray[idx]);

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
  findUnusedGenerationOrCreate,
  testConnection,
  saveFeedback,
  generateFeedbackData,
  saveHighlight,
  deleteHighlight,
  uploadHighlightImage,
  updateLevel,
  checkAnswer,
  getRecordsByUser,
  getTextById,
};