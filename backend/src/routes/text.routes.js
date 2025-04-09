// routes/text.routes.js

const express = require('express');
const router = express.Router();
const textController = require('../controllers/text.controller');

/**
 * @swagger
 * /api/text/validate-keyword:
 *   post:
 *     summary: Validate if the given keyword is allowed and meets the required criteria
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
 *                 description: The keyword to validate
 *     responses:
 *       200:
 *         description: The keyword is valid and meets the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '유효한 키워드입니다.'
 *       400:
 *         description: Invalid keyword or keyword length exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '금지된 키워드입니다. 다시 입력해 주세요.'
 *       500:
 *         description: Failed to validate keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '키워드 검증 오류.'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */
router.post('/validate-keyword', textController.validateKeyword);

/**
 * @swagger
 * /api/text/request-generation:
 *   post:
 *     summary: Generate a single text set based on the provided keyword and level
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
 *                 description: The keyword for generating text
 *               level:
 *                 type: string
 *                 description: The level of the generated content
 *     responses:
 *       201:
 *         description: The text set has been successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 keyword:
 *                   type: string
 *                   example: 'math'
 *                 level:
 *                   type: string
 *                   example: 'easy'
 *                 passage:
 *                   type: string
 *                   example: 'This is a sample passage.'
 *                 question:
 *                   type: string
 *                   example: 'What is 2 + 2?'
 *                 answer:
 *                   type: string
 *                   example: '4'
 *                 solution:
 *                   type: string
 *                   example: 'The solution is simple addition.'
 *       400:
 *         description: Failed to generate text due to invalid keyword or other errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '텍스트 생성 실패'
 *       500:
 *         description: Server error during text generation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to generate text.'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */
// router.post('/request-generation', textController.createText);

/**
 * @swagger
 * /api/text/request-generation-3:
 *   post:
 *     summary: Generate three text sets based on the provided keyword and level
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
 *                 description: The keyword for generating text
 *               level:
 *                 type: string
 *                 description: The level of the generated content
 *     responses:
 *       201:
 *         description: The text sets have been successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   keyword:
 *                     type: string
 *                     example: 'math'
 *                   level:
 *                     type: string
 *                     example: 'easy'
 *                   passage:
 *                     type: string
 *                     example: 'This is a sample passage.'
 *                   question:
 *                     type: string
 *                     example: 'What is 2 + 2?'
 *                   answer:
 *                     type: string
 *                     example: '4'
 *                   solution:
 *                     type: string
 *                     example: 'The solution is simple addition.'
 *       400:
 *         description: Failed to generate text sets due to invalid keyword or other errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '텍스트 생성 실패'
 *       500:
 *         description: Server error during text generation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to generate texts.'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */
// router.post('/request-generation-3', textController.createText3);

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

/**
 * @swagger
 * /api/text/{id}/feedback:
 *   post:
 *     summary: Save user feedback for a specific text
 *     tags: [Text]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the text to provide feedback for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user providing feedback
 *               feedback:
 *                 type: string
 *                 description: The feedback value (e.g., easy, hard, boring)
 *     responses:
 *       201:
 *         description: Feedback saved successfully
 *       400:
 *         description: Invalid feedback value
 *       500:
 *         description: Failed to save feedback
 */
router.post('/:id/feedback', textController.saveFeedback);

/**
 * @swagger
 * /api/text/{id}/highlight:
 *   post:
 *     summary: Save a highlight for a specific text
 *     tags: [Text]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the text to highlight
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user creating the highlight
 *               start:
 *                 type: integer
 *                 description: The starting position of the highlight in the text
 *               end:
 *                 type: integer
 *                 description: The ending position of the highlight in the text
 *               text:
 *                 type: string
 *                 description: The text being highlighted
 *     responses:
 *       201:
 *         description: Highlight saved successfully
 *       500:
 *         description: Failed to save highlight
 */
router.post('/:id/highlight', textController.saveHighlight);

/**
 * @swagger
 * /api/text/{id}/answer:
 *   post:
 *     summary: Check user's answer for a specific text
 *     tags: [Text]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the text for which to check the answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user checking the answer
 *               answer:
 *                 type: string
 *                 description: The user's answer
 *     responses:
 *       200:
 *         description: The answer is correct or not
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isCorrect:
 *                   type: boolean
 *                   description: Whether the user's answer was correct
 *       404:
 *         description: Text not found
 *       500:
 *         description: Failed to check answer
 */
router.post('/:id/answer', textController.checkAnswer);

/**
 * @swagger
 * /api/text/{id}/result:
 *   post:
 *     summary: Save the result of a learning session for a specific text
 *     tags: [Text]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the text to save the result for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user saving the result
 *               answer:
 *                 type: string
 *                 description: The user's answer
 *               isCorrect:
 *                 type: boolean
 *                 description: Whether the user's answer was correct
 *     responses:
 *       201:
 *         description: Learning result saved successfully
 *       500:
 *         description: Failed to save learning result
 */
router.post('/:id/result', textController.saveResult);


module.exports = router;