// controllers/text.controller.js

const textService = require('../services/text.service');
const User = require('../models/user')
const Class = require('../models/class')
const Text = require('../models/text');
const Record = require('../models/record');
const Keyword = require('../models/keyword');
const ErrorLog = require('../models/errorLog');

// POST /api/text/keywords/validate
exports.validateKeyword = (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ message: '키워드를 입력해 주세요.' });
  }

  try {

    if (textService.containsForbiddenKeyword(keyword)) {
      return res.status(400).json({ message: '금지된 키워드입니다. 다시 입력해 주세요.' });
    }

    return res.status(200).json({ message: '유효한 키워드입니다.' });
  } catch (error) {
    return res.status(500).json({ message: '키워드 검증 중 오류가 발생했습니다.' });
  }
};


// POST /api/text/contents/:level?type=xxx
exports.generateContentsController = async (req, res) => {

  try {
    // console.log('req.user:', req.user);
    const { level } = req.params;
    const type = req.query.type;
    const { keyword } = req.body;

    const token = req.headers.authorization?.split(' ')[1];  // extract token

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user ID missing in token' });
    }

    // level validation
    if (!['low', 'middle', 'high'].includes(level)) {
      return res.status(400).json({ message: 'ERROR: invalid level' });
    }

    // type validation
    if (!['inferred', 'assigned', 'selected'].includes(type)) {
      return res.status(400).json({ message: 'ERROR: invalid type' });
    }

    // 사용자 정보 갱신
    const user = await User.findById(userId)
      .select('username name student_info class_id')
      .populate('class_id', 'school_name class_name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let userLevel;
    if (type === 'inferred') {
      userLevel = user.student_info?.inferred_level;
    } else if (type === 'assigned') {
      userLevel = user.student_info?.assigned_level;
    } else if (type === 'selected') {
      userLevel = level;
    }

    if (!userLevel) {
      return res.status(403).json({ message: 'Access denied: user level info missing' });
    }

    // validation for selected type
    if (type !== 'selected' && userLevel !== level) {
      return res.status(403).json({ message: `Access denied: user level mismatch (${userLevel} !== ${level})` });
    }

    // keyword tracking
    const keywordDoc = await textService.saveKeywordData({ keyword, level, type, user });

    const result = await textService.requestGeneration(
      keyword,
      level,
      userId,
      type,
      token,
      {
        username: user.username || '',
        name: user.name || '',
      }
    );

    // generation0, generation1, generation2에 대한 기본 검증
    const requiredGenerations = ['generation0', 'generation1', 'generation2'];
    const missing = requiredGenerations.some(key => !result?.[key]);

    if (missing) {
      return res.status(500).json({ message: 'Invalid generation result format!' });
    }

    // 세부 오류 처리
    const generationErrorType = textService.detectGenerationError(result);

    if (generationErrorType) {
      console.log('Saving error log:', {
        keyword,
        level,
        type,
        errorType: generationErrorType,
        stackTrace: JSON.stringify(result).slice(0, 100),
        user,
      });

      await textService.saveErrorLog({
        keyword,
        level,
        type,
        errorType: generationErrorType,
        stackTrace: JSON.stringify(result).slice(0, 100),
        user,
      });

      const statusCode = textService.GenerationErrorStatusCodes[generationErrorType] || 500;
      const clientMessage = '일시적인 오류가 발생했습니다. 다시 시도해 주세요.';

      return res.status(statusCode).json({
        message: clientMessage,
        detail: result,
      });
    }

    await textService.saveGenerationData({
      keyword,
      level,
      type,
      user,
      result,
      keywordId: keywordDoc?._id,
    });

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message,
      forbiddenWords: error.forbiddenWords || [],
    });
  }
};


// GET /api/text/test
exports.testTextConnection = async (req, res) => {
  const result = await textService.testConnection();

  if (result.success) {
    return res.status(200).json({
      message: result.message,
      data: result.data
    });
  } else {
    return res.status(500).json({
      message: result.message,
      error: result.error
    });
  }
};


// POST /api/text/feedback
exports.saveFeedbackController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { keyword, level, feedbacks } = req.body;

    const feedbackData = {
      userId,
      keyword,
      level,
      feedbacks,
    };

    const result = await textService.saveFeedback(feedbackData);

    res.status(200).json({ message: 'Feedback saved successfully!', data: result });
  } catch (error) {
    console.error('Error in saving feedback:', error.message);
    res.status(500).json({ message: 'Failed to save feedback', error: error.message });
  }
};


// POST /api/text/generation
exports.saveGenerationController = async (req, res) => {
  try {
    const { keyword, level, title, passage, question, answer, solution } = req.body;

    if (!keyword || !level || !title || !passage || !question || !answer || !solution) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newText = new Text({
      keyword,
      level,
      title,
      passage,
      question,
      answer,
      solution,
    });

    const savedText = await newText.save();

    return res.status(200).json({
      message: 'Selected generation saved successfully!',
      data: savedText,
    });
  } catch (error) {
    console.error('Error saving generation:', error.message);
    return res.status(500).json({
      message: 'Failed to save generation',
      error: error.message,
    });
  }
};


// POST /api/text/highlight
exports.saveHighlightController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { text, label, textId } = req.body;

    if (!text || !textId) {
      return res.status(400).json({ message: 'Text and textId are required for highlight.' });
    }

    const highlightData = {
      userId,
      text,  // highlighted text
      label,
      textId,
    };

    const result = await textService.saveHighlight(highlightData);

    res.status(200).json({ message: 'Highlight saved successfully!', data: result });
  } catch (error) {
    console.error('Error in saving highlight:', error.message);
    res.status(500).json({ message: 'Failed to save highlight', error: error.message });
  }
};


// DELETE /api/text/highlight
exports.deleteHighlightController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Highlight ID is required to delete.' });
    }

    const result = await textService.deleteHighlight(userId, id);

    if (!result) {
      return res.status(404).json({ message: 'Highlight not found.' });
    }

    res.status(200).json({ message: 'Highlight deleted successfully.' });
  } catch (error) {
    console.error('Error deleting highlight:', error.message);
    res.status(500).json({ message: 'Failed to delete highlight', error: error.message });
  }
};


// POST /api/text/highlight/image
exports.uploadHighlightImageController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { imageBase64, highlightIds, textId } = req.body;

    if (!imageBase64 || !highlightIds?.length || !textId) {
      return res.status(400).json({ message: 'Image, highlight IDs, and textId are required' });
    }

    const imageUrl = await textService.uploadHighlightImage({
      userId,
      base64Image: imageBase64,
      highlightIds,
      textId,
    });

    res.status(200).json({ message: 'Image uploaded and highlights updated', imageUrl });
  } catch (err) {
    console.error('uploadHighlightImageController error:', err.message);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};


// POST /api/text/answers/verify
exports.checkAnswerController = async (req, res) => {

  const { userId } = req.user;
  const { keyword, level, title, passage, question, answer, solution, userAnswer, elapsedSeconds, mode, feedbackId, textId } = req.body;

  try {
    const { userAnswer: userAnswerStrArray, correctness } = textService.checkAnswer(userAnswer, answer);

    const score = correctness.filter(isCorrect => isCorrect).length;

    // save data in 'Record' collection
    const newRecord = new Record({
      userId,
      textId,
      correctness,
      userAnswer: userAnswerStrArray,
      correctAnswer: answer,
      score,
      elapsedSeconds,
      mode,
      feedbackId,
    });
    await newRecord.save();

    const newLevel = await textService.updateLevel(userId, score, mode);

    return res.status(200).json({
      score,
      correctness,
      userAnswer: userAnswerStrArray,
      correctAnswer: answer,
      newLevel,
      message: 'Answers checked!',
    });
  } catch (error) {
    console.error('Error checking answers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check answers.',
    });
  }
};


// GET /api/text/records
exports.getUserRecordsController = async (req, res) => {
  try {
    const { userId } = req.user;

    const records = await textService.getRecordsByUser(userId);

    res.status(200).json({ message: 'User records fetched successfully', data: records });
  } catch (error) {
    console.error('Error in fetching user records:', error.message);
    res.status(500).json({ message: 'Failed to fetch user records', error: error.message });
  }
};


// GET /api/text/contents/:textId
exports.getTextByIdController = async (req, res) => {
  try {
    const { textId } = req.params;

    const text = await textService.getTextById(textId);
    return res.status(200).json({ message: 'Text fetched successfully', data: text });
  } catch (error) {
    console.error('Error in getTextByIdController:', error.message);
    return res.status(500).json({ message: 'Failed to fetch text', error: error.message });
  }
};