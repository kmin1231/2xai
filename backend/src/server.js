// server.js

require('dotenv').config();

const fs = require('fs');
const https = require('https');

const app = require('./app');
const connectDB = require('./db/connect');

const PORT = process.env.PORT || 443;
const SERVER_URL = process.env.SERVER_URL || "http://localhost";

const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

connectDB().then(() => {
  const sslOptions = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH),
  };
  
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Server is running on ${SERVER_URL}:${PORT}`);
    console.log(`Swagger UI is available on ${SERVER_URL}:${PORT}/api-docs`);
  });
});