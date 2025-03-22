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