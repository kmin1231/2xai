// app.js

const express = require('express');
const app = express();

const authRoutes = require('./routes/auth.routes');
const textRoutes = require('./routes/text.routes');
const teacherRoutes = require('./routes/teacher.routes');
const studentRoutes = require('./routes/student.routes');
const adminRoutes = require('./routes/admin.routes');

// Swagger UI
const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/text', textRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('[app.js] Server is running!');
});

module.exports = app;