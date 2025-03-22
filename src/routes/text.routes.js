// routes/text.routes.js

const express = require('express');
const router = express.Router();
const textController = require('../controllers/text.controller');

/**
 * @swagger
 * /api/text/create:
 *   post:
 *     summary: Create a new text based on the given keyword and level
 *     tags: [Text]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: The keyword to generate the text
 *               level:
 *                 type: string
 *                 description: The level of difficulty for the text
 *     responses:
 *       201:
 *         description: Text created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 keyword:
 *                   type: string
 *                 level:
 *                   type: string
 *                 passage:
 *                   type: string
 *                 question:
 *                   type: string
 *                 answer:
 *                   type: string
 *                 solution:
 *                   type: string
 *       400:
 *         description: Invalid keyword or keyword length exceeded
 *       500:
 *         description: Failed to create text
 */

router.post('/create', textController.createText);


/**
 * @swagger
 * /api/text/filter:
 *   get:
 *     summary: Filter text based on the given keyword, level, and user ID
 *     tags: [Text]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: The keyword to filter the text
 *       - in: query
 *         name: level
 *         required: true
 *         schema:
 *           type: string
 *         description: The level of difficulty to filter the text
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user requesting the text
 *     responses:
 *       200:
 *         description: Successfully filtered or generated the text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 keyword:
 *                   type: string
 *                 level:
 *                   type: string
 *                 passage:
 *                   type: string
 *                 question:
 *                   type: string
 *                 answer:
 *                   type: string
 *                 solution:
 *                   type: string
 *       500:
 *         description: Failed to filter text
 */

router.get('/filter', textController.filterText);


module.exports = router;