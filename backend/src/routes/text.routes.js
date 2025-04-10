// routes/text.routes.js

const express = require('express');
const router = express.Router();
const textController = require('../controllers/text.controller');

/**
 * @swagger
 * /api/text/validate-keyword:
 *   post:
 *     summary: Validate if the given keyword is allowed (must not include any forbidden terms)
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
 *                 description: The keyword to validate. The keyword must not include any forbidden terms.
 *                 example: "Around the world in 80 days"
 *     responses:
 *       200:
 *         description: The keyword is valid and does not include any forbidden words
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '유효한 키워드입니다.'
 *       400:
 *         description: The keyword includes a forbidden term or is otherwise invalid
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
 *                   example: '키워드 검증 중 오류가 발생했습니다.'
 */
router.post('/validate-keyword', textController.validateKeyword);

/**
 * @swagger
 * /api/text/generate-text:
 *   post:
 *     summary: Generate a single set of text content based on keyword and level
 *     tags: [Text]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyword
 *               - level
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: volcano
 *               level:
 *                 type: string
 *                 enum: [high, normal, easy]
 *                 example: normal
 *     responses:
 *       201:
 *         description: Successfully generated text content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 661690f2fabc1234567890ab
 *                 keyword:
 *                   type: string
 *                   example: volcano
 *                 level:
 *                   type: string
 *                   enum: [high, normal, easy]
 *                   example: normal
 *                 passage:
 *                   type: string
 *                   example: A volcano is an opening in the Earth's crust...
 *                 question:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["What is a volcano?", "Where do they occur?", "How are they formed?", "What are the risks?", "Name an example."]
 *                 answer:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Opening in Earth's crust", "Near plate boundaries", "..."]
 *                 solution:
 *                   type: string
 *                   example: The answers are derived from the passage above.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-04-10T14:48:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-04-10T14:48:00.000Z
 *       400:
 *         description: Invalid input or forbidden keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Keyword is forbidden or invalid.
 *       500:
 *         description: Internal server error during content generation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to generate text contents.
 */
router.post('/generate-text', textController.createText); 

/**
 * @swagger
 * /api/text/generate-text-3:
 *   post:
 *     summary: Generate three sets of text content based on keyword and level
 *     tags: [Text]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyword
 *               - level
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: volcano
 *               level:
 *                 type: string
 *                 enum: [high, normal, easy]
 *                 example: normal
 *     responses:
 *       201:
 *         description: Successfully generated three sets of text content
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 661690f2fabc1234567890ab
 *                   keyword:
 *                     type: string
 *                     example: volcano
 *                   level:
 *                     type: string
 *                     enum: [high, normal, easy]
 *                     example: normal
 *                   passage:
 *                     type: string
 *                     example: A volcano is an opening in the Earth's crust...
 *                   question:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["What is a volcano?", "Where do they occur?", "How are they formed?", "What are the risks?", "Name an example."]
 *                   answer:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Opening in Earth's crust", "Near plate boundaries", "..."]
 *                   solution:
 *                     type: string
 *                     example: The answers are derived from the passage above.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-10T14:48:00.000Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-10T14:48:00.000Z
 *       400:
 *         description: Invalid input or forbidden keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Keyword is forbidden or invalid.
 *       500:
 *         description: Internal server error during content generation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to generate text contents.
 */
router.post('/generate-text-3', textController.createText3);

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


/**
 * @swagger
 * components:
 *   schemas:
 *     Text:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document ID
 *           example: 661690f2fabc1234567890ab
 *         keyword:
 *           type: string
 *           example: volcano
 *         level:
 *           type: string
 *           enum: [high, normal, easy]
 *           example: normal
 *         passage:
 *           type: string
 *           example: A volcano is an opening in the Earth's crust...
 *         question:
 *           type: array
 *           items:
 *             type: string
 *           example: ["What is a volcano?", "Where do they occur?", "..."]
 *         answer:
 *           type: array
 *           items:
 *             type: string
 *           example: ["An opening in the crust", "Near tectonic boundaries", "..."]
 *         solution:
 *           type: string
 *           example: The answers are derived from the passage above.
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


module.exports = router;