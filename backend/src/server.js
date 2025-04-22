// server.js

require('dotenv').config();

const app = require('./app');
const connectDB = require('./db/connect');
const User = require('./models/user');
const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL || "http://localhost";


connectDB().then(() => {
    createTestUsers();
    app.listen(PORT, () => {
      console.log(`Server is running on ${SERVER_URL}:${PORT}`);
      console.log(`Swagger UI is available on ${SERVER_URL}:${PORT}/api-docs`);
    });
  });


const createUser = async (username, password, name, role, level) => {
  try {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      const user = new User({
        username,
        password,
        name,
        role,
        school: '경희중학교',
        class: '3반',
        level,
      });

      await user.save();
      // console.log(`${role} user (${username}) created`);
    } else {
      // console.log(`${role} user (${username}) already exists`);
      existingUser.level = level;
      await existingUser.save();
    }
  } catch (error) {
    console.error(`Error creating ${role} user:`, error.message);
  }
};
  
const createTestUsers = async () => {
  await createUser('admin', 'admin', '관리자', 'admin', 'low');
  await createUser('low', 'low', '김low', 'student', 'low');
  await createUser('middle', 'middle', '김middle', 'student', 'middle');
  await createUser('high', 'high', '김high', 'student', 'high');
  await createUser('teacher', 'teacher', '이경희', 'teacher','low');
  console.log('Test accounts activated: admin, student, teacher');
};