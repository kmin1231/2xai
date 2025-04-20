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


const createUser = async (username, password, name, role, level = 'low') => {
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
    }
  } catch (error) {
    console.error(`Error creating ${role} user:`, error.message);
  }
};
  
const createTestUsers = async () => {
  await createUser('admin', 'admin', 'Administrator', 'admin');
  await createUser('student', 'student', '김경희', 'student');
  await createUser('teacher', 'teacher', '이경희', 'teacher');
  console.log('Test accounts activated: admin, student, teacher');
};