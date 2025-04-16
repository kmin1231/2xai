// controllers/student.controller.js

const User = require('../models/user');
const Record = require('../models/record');

const updateLevels = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });

    for (let student of students) {
      const records = await Record.find({ userId: student._id }).sort({ createdAt: 1 });

      let correctCount = 0;
      let level = student.level;

      const firstFiveRecords = records.slice(0, 5);
      if (firstFiveRecords.length === 5) {
        correctCount = firstFiveRecords.filter(record => record.isCorrect).length;
        if (correctCount === 5) {
          level = 'high';
        } else if (correctCount <= 1) {
          level = 'low';
        } else {
          level = 'middle';
        }
      }

      if (firstFiveRecords.length > 0) {
        let nextFiveRecords = records.slice(5, 10);
        let correctNextFiveCount = nextFiveRecords.filter(record => record.isCorrect).length;

        if (level === 'high') {
          if (correctNextFiveCount <= 2) level = 'normal';
          else if (correctNextFiveCount >= 3) level = 'hard';
        }

        if (level === 'middle') {
          if (correctNextFiveCount <= 1) level = 'easy';
          else if (correctNextFiveCount === 5) level = 'hard';
        }

        if (level === 'low') {
          if (correctNextFiveCount <= 3) level = 'easy';
          else if (correctNextFiveCount >= 4) level = 'normal';
        }
      }

      student.level = level;
      await student.save();
    }

    return res.status(200).json({ message: 'Levels updated successfully for all students.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating student levels.', error });
  }
};


module.exports = { updateLevels };