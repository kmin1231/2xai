// services/text.service.js

require('dotenv').config();

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { parse } = require('xlsx');

const Text = require('../models/text');
const Record = require('../models/record');


const loadBadKeywords = async () => {
  try {
    const filePath = path.resolve(__dirname, '../../data/badwords.xlsx');
    const workbook = parse(fs.readFileSync(filePath));
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const forbiddenKeywords = [];
    
    // extract inappropriate keywords (A1:A4923)
    for (let row = 1; row <= 4923; row++) {
      const keyword = worksheet[`A${row}`]?.v;
      if (keyword) forbiddenKeywords.push(keyword.trim());
    }

    return forbiddenKeywords;
  } catch (error) {
    throw new Error('Failed to load forbidden keywords.');
  }
};


const generateText = async (keyword, level) => {
  try {
    const response = await axios.post(process.env.CONTENTS_API, { keyword, level });
    const newContents = response.data;

    const newText = new Text({
      keyword,
      level,
      passage: newContents.passage,
      question: newContents.question,
      answer: newContents.answer,
      solution: newContents.solution,
    });

    await newText.save();
    return newText;
  } catch (error) {
    throw new Error('Failed to generate text from external API.');
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


module.exports = {
  generateText,
  filterText,
  checkRecord,
  loadBadKeywords,
};