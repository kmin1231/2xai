// routes/text.routes.js

const express = require('express');
const router = express.Router();
const textController = require('../controllers/text.controller');
const { verifyToken } = require('../middleware/auth.middleware');

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
 *     summary: Generate text based on the provided keyword and user level (Authorization required)
 *     tags: [Text]
 *     description: 로그인된 사용자가 제공한 keyword에 대해 텍스트 생성을 요청합니다. 유효한 토큰을 포함한 인증이 필요합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: The keyword to generate text for.
 *                 example: "Around the World in 80 Days"
 *     responses:
 *       200:
 *         description: Successfully generated text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 keyword:
 *                   type: string
 *                   example: "Around the World in 80 Days"
 *                 level:
 *                   type: string
 *                   example: "low"
 *                 generation1:
 *                   type: object
 *                   properties:
 *                     passage:
 *                       type: string
 *                       example: "..."
 *                     question:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: ["Question 1", "Question 2"]
 *                     answer:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: ["Answer 1", "Answer 2"]
 *                     solution:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: ["Solution 1", "Solution 2"]
 *       400:
 *         description: Invalid level or request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ERROR: invalid level"
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentication required. Please provide a valid token."
 *       500:
 *         description: Failed to generate text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "텍스트 생성 중 오류가 발생했습니다."
 */
router.post('/generate-text', verifyToken, textController.generateText);


/**
 * @swagger
 * /api/text/generate-text-low:
 *   post:
 *     summary: Generate text at a low level using the provided keyword
 *     description: |
 *       Generates 3 sets of text content (passage, questions, answers, solutions) at a low difficulty level.
 *       Each content generation request is now handled **sequentially**, not concurrently, to improve stability and reduce load on the content API.
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
 *                 description: The keyword to generate content for.
 *                 example: "Around the world in 80 days"
 *     responses:
 *       200:
 *         description: Successfully generated text at a low level
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 keyword:
 *                   type: string
 *                   example: "Around the world in 80 days"
 *                 level:
 *                   type: string
 *                   example: "low"
 *                 generation0:
 *                   type: object
 *                   properties:
 *                     passage:
 *                       type: string
 *                     question:
 *                       type: array
 *                       items:
 *                         type: string
 *                     answer:
 *                       type: array
 *                       items:
 *                         type: string
 *                     solution:
 *                       type: array
 *                       items:
 *                         type: string
 *                 generation1:
 *                   type: object
 *                   properties:
 *                     passage:
 *                       type: string
 *                     question:
 *                       type: array
 *                       items:
 *                         type: string
 *                     answer:
 *                       type: array
 *                       items:
 *                         type: string
 *                     solution:
 *                       type: array
 *                       items:
 *                         type: string
 *                 generation2:
 *                   type: object
 *                   properties:
 *                     passage:
 *                       type: string
 *                     question:
 *                       type: array
 *                       items:
 *                         type: string
 *                     answer:
 *                       type: array
 *                       items:
 *                         type: string
 *                     solution:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Invalid keyword provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid keyword.'
 *       500:
 *         description: Failed to generate content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '텍스트 생성 중 오류가 발생했습니다.'
 */
router.post('/generate-text-low', textController.generateTextLow);


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