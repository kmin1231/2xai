// app.js

const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const { swaggerUi, swaggerSpec } = require('./swagger');

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('[app.js] Server is running!');
});

module.exports = app;