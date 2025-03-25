// controllers/text.controller.js

const textService = require('../services/text.service');

// POST /api/text/create
exports.createText = async (req, res) => {
  const { keyword, level } = req.body;

  try {
    const forbiddenKeywords = await textService.loadForbiddenKeywords();

    // keyword validation
    if (forbiddenKeywords.includes(keyword)) {
      return res.status(400).json({ message: 'This keyword is not allowed.' });
    }

    // keyword length check
    const keywordWords = keyword.split(' ').length;
    if (keywordWords > 10) {
      return res.status(400).json({ message: 'Keyword must be 10 words or fewer.' });
    }

    // generate new text contents
    const newText = await textService.generateText(keyword, level);
    return res.status(201).json(newText);
    
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create text.', error });
  }
};


// GET /api/text/filter 
exports.filterText = async (req, res) => {
  const { keyword, level, userId } = req.query;

  try {
    let text = await textService.filterText(keyword, level);

    if (!text) {
      text = await textService.generateText(keyword, level);
    }

    const userRecord = await textService.checkRecord(userId, text._id);

    if (userRecord) {
      const externalText = await textService.generateText(keyword, level);
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
