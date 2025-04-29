// server.js

require('dotenv').config();

const app = require('./app');
const connectDB = require('./db/connect');
const User = require('./models/user');
const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL || "http://localhost";


connectDB().then(() => {
    // createTestUsers();
    app.listen(PORT, () => {
      console.log(`Server is running on ${SERVER_URL}:${PORT}`);
      console.log(`Swagger UI is available on ${SERVER_URL}:${PORT}/api-docs`);
    });
});