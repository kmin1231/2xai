// swagger.js

require('dotenv').config();

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const SERVER_URL = process.env.SERVER_URL || 'http://localhost';
const PORT = process.env.PORT || 5000;

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "0.1.0",
      title: "2xAI server API",
      description: "Server API for 2xAI learning interface"
    },
    
    servers: [
      {
        url: `${SERVER_URL}:${PORT}`,
        description: "GCP VM API server"
      },
    ],
  },
  apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };