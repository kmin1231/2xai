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


// POST api/text/generate-text
exports.createText = async (req, res) => {
  const { keyword, level } = req.body;
  
  if (!keyword || !level) {
    return res.status(400).json({ message: 'keyword and level are required fields.' });
  }

  try {
    const newText = await textService.requestGeneration(keyword, level);
    console.log('Contents generated successfully\n', newText);
    return res.status(201).json(newText);
  } catch (error) {
    console.error('Error generating contents:', error.message);
    return res.status(400).json({ message: error.message || 'Failed to generate contents' });
  }
};


// POST api/text/generate-text-3
exports.createText3 = async (req, res) => {
  const { keyword, level } = req.body;

  if (!keyword || !level) {
    return res.status(400).json({ message: 'Both keyword and level are required.' });
  }

  try {
    const generatedTexts = await textService.requestGeneration3(keyword, level);
    console.log('THREE sets of content generated successfully:\n', generatedTexts);
    return res.status(201).json(generatedTexts);
  } catch (error) {
    console.error('Error generating THREE content sets:', error.message, error.stack);
    return res.status(400).json({ message: error.message || 'Failed to generate text contents.' });
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
