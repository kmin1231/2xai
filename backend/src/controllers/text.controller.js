// controllers/text.controller.js

const textService = require('../services/text.service');

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
    const { keyword } = req.body;
    const level = req.user?.level;

    if (!level || !['low', 'middle', 'high'].includes(level)) {
      return res.status(400).json({ message: 'ERROR: invalid level' });
    }

    const result = await textService.requestGeneration(keyword, level);
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


// POST /api/text/:id/feedback
exports.saveFeedback = async (req, res) => {
  const { id } = req.params;  // textId
  const { userId, feedback } = req.body;

  try {
    if (!['easy', 'hard', 'boring'].includes(feedback)) {
      return res.status(400).json({ message: 'Invalid feedback value.' });
    }

    const newFeedback = new Feedback({
      userId,
      textId: id,
      feedback,
    });

    await newFeedback.save();
    return res.status(201).json({ message: 'Feedback saved successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save feedback.', error });
  }
};


// POST /api/text/:id/highlight
exports.saveHighlight = async (req, res) => {
  const { id } = req.params;
  const { userId, start, end, text } = req.body;

  try {
    const newHighlight = new Highlight({
      userId,
      textId: id,
      start,
      end,
      text,
    });

    await newHighlight.save();
    return res.status(201).json({ message: 'Highlight saved successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save highlight.', error });
  }
};


// POST /api/text/:id/answer
exports.checkAnswer = async (req, res) => {
  const { id } = req.params;
  const { userId, answer } = req.body;

  try {
    const text = await Text.findById(id);

    if (!text) {
      return res.status(404).json({ message: 'Text not found.' });
    }

    const isCorrect = text.answer === answer;

    const newRecord = new Record({
      userId,
      textId: id,
      isCorrect,
    });

    await newRecord.save();

    return res.status(200).json({ isCorrect });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to check answer.', error });
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
