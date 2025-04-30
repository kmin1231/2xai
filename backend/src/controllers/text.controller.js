// controllers/text.controller.js

const textService = require('../services/text.service');
const Text = require('../models/text');
const Record = require('../models/record');

// POST /api/text/validate-keyword
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


// POST /api/text/generate-text
exports.generateText = async (req, res) => {
  try {

    console.log('req.user:', req.user);
    const { keyword } = req.body;
    const inferredLevel = req.user?.inferredLevel;


    if (!inferredLevel || !['low', 'middle', 'high'].includes(inferredLevel)) {
      console.error('Invalid inferred level:', inferredLevel);
      return res.status(400).json({ message: 'ERROR: invalid level' });
    }

    const token = req.headers.authorization?.split(' ')[1];  // extract token

    const result = await textService.requestGeneration(keyword, inferredLevel, token);  // token
    
    res.status(200).json(result);

  } catch (error) {
    console.error('Error generating text:', error.message);

    const status = error.status || 500;
    const message =
      error.message === '금지어가 포함되어 있습니다.'
        ? '입력한 키워드에 금지어가 포함되어 있습니다.'
        : '텍스트 생성 중 오류가 발생했습니다.';

    res.status(status).json({ message });
  }
};


// POST /api/text/generate-text-low
exports.generateTextLow = async (req, res) => {
  try {
    const { keyword } = req.body;
    
    const level = 'low';  // fixed level

    const result = await textService.requestGeneration(keyword, level);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error generating low-level text:', error.message);

    const status = error.status || 500;
    const message =
      error.message === '금지어가 포함되어 있습니다.'
        ? '입력한 키워드에 금지어가 포함되어 있습니다.'
        : '텍스트 생성 중 오류가 발생했습니다.';

    res.status(status).json({ message });
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


// GET /api/text/filter 
exports.filterText = async (req, res) => {
  const { keyword, level, userId } = req.query;

  try {
    let text = await textService.filterText(keyword, level);

    if (!text) {
      text = await textService.requestGeneration(keyword, level);
    }

    const userRecord = await textService.checkRecord(userId, text._id);

    if (userRecord) {
      const externalText = await textService.requestGeneration(keyword, level);
      return res.status(200).json(externalText);
    }

    return res.status(200).json(text);

  } catch (error) {
    return res.status(500).json({ message: 'Failed to filter text.', error });
  }
};


// POST /api/text/feedback
exports.saveFeedbackController = async (req, res) => {
  try {

    const { userId } = req.user;
    const { keyword, level, feedbacks } = req.body;

    // generate feedback data
    const feedbackData = textService.generateFeedbackData(keyword, level, feedbacks);

    feedbackData.userId = userId;

    const result = await textService.saveFeedback(feedbackData);

    res.status(200).json({ message: 'Feedback saved successfully!', data: result });
  } catch (error) {
    console.error('Error in saving feedback:', error.message);
    res.status(500).json({ message: 'Failed to save feedback', error: error.message });
  }
};


// POST /api/text/highlight
exports.saveHighlightController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required for highlight.' });
    }

    const highlightData = {
      userId,
      text,  // highlighted text
    };

    const result = await textService.saveHighlight(highlightData);

    res.status(200).json({ message: 'Highlight saved successfully!', data: result });
  } catch (error) {
    console.error('Error in saving highlight:', error.message);
    res.status(500).json({ message: 'Failed to save highlight', error: error.message });
  }
};


// POST /api/text/check-answer
exports.checkAnswerController = async (req, res) => {

  const { userId } = req.user;
  const { keyword, level, title, passage, question, answer, solution, userAnswer } = req.body;
  
  try {
    const correctAnswers = answer;
    const correctness = textService.checkAnswer(userAnswer, correctAnswers);

    const score = correctness.filter(isCorrect => isCorrect).length;

    // save data in 'Text' collection
    const newText = new Text({
      keyword,
      level,
      title,
      passage,
      question,
      answer,
      solution,
    });
    await newText.save();

    // save data in 'Record' collection
    const newRecord = new Record({
      userId,
      textId: newText._id,
      correctness,
      score,
    });
    await newRecord.save();

    const newLevel = await textService.updateLevel(userId, score);

    return res.status(200).json({
      score,
      correctness,
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


// POST /api/text/:id/answer
exports.saveResult = async (req, res) => {
  const { id } = req.params;
  const { userId, answer, isCorrect } = req.body;

  try {
    const newRecord = new Record({
      userId,
      textId: id,
      isCorrect,
    });

    await newRecord.save();

    return res.status(201).json({ message: 'Learning result saved successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save learning result.', error });
  }
};