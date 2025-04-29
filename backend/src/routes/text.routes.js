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
 *                 example: "Harry Potter"
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
 *     security:
 *       - BearerAuth: []  # Authorization Header
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
 *                 example: "Harry Potter"
 *     responses:
 *       200:
 *         description: Successfully generated text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 keyword: "Harry Potter"
 *                 level: "low"
 *                 generation0:
 *                   title: "Who is Harry Potter?"
 *                   passage: "Harry Potter is a young wizard who discovers he has magical powers on his 11th birthday.\nHe attends Hogwarts School of Witchcraft and Wizardry and becomes famous for surviving an attack by the dark wizard Voldemort when he was a baby.\nHarry makes close friends like Ron Weasley and Hermione Granger, and together they face many magical adventures.\nThe story follows Harry as he grows up, learns magic, and fights against evil."
 *                   question:
 *                     - "What is Harry Potter?\nA normal boy\nA doctor\nA wizard\nA vampire\nA detective"
 *                     - "Where does Harry go to learn magic?\nDurmstrang\nBeauxbatons\nHogwarts\nIlvermorny\nUagadou"
 *                     - "Who is Harry's best friend?\nDraco Malfoy\nNeville Longbottom\nRon Weasley\nDudley Dursley\nCedric Diggory"
 *                     - "Who is the main villain in the series?\nSnape\nDumbledore\nHagrid\nVoldemort\nSirius Black"
 *                     - "What is Harry famous for?\nBeing a Quidditch player\nBeing rich\nDefeating dragons\nSurviving Voldemort's curse\nOwning a magical pet"
 *                   answer: ["c", "c", "c", "d", "d"]
 *                   solution:
 *                     - "Harry is a wizard, not a normal boy or vampire."
 *                     - "Harry studies magic at Hogwarts."
 *                     - "Ron Weasley is Harry’s closest friend."
 *                     - "Voldemort is the main villain throughout the series."
 *                     - "He is known for surviving Voldemort's curse as a baby."
 *                 generation1:
 *                   title: "Life at Hogwarts"
 *                   passage: "At Hogwarts, students are sorted into four houses: Gryffindor, Hufflepuff, Ravenclaw, and Slytherin.\nHarry is sorted into Gryffindor, where he meets many of his friends.\nStudents attend classes like Potions, Defense Against the Dark Arts, and Transfiguration.\nThey learn spells, fly on broomsticks, and take magical exams.\nHogwarts is also full of secrets, including moving staircases and hidden rooms."
 *                   question:
 *                     - "How many houses are at Hogwarts?\nTwo\nThree\nFour\nFive\nSix"
 *                     - "Which house is Harry sorted into?\nSlytherin\nRavenclaw\nHufflepuff\nGryffindor\nDurmstrang"
 *                     - "What class teaches students to defend themselves?\nHerbology\nCharms\nDefense Against the Dark Arts\nDivination\nAstronomy"
 *                     - "What do students use to fly?\nWands\nCapes\nShoes\nBroomsticks\nSpells"
 *                     - "What is special about the Hogwarts staircases?\nThey're made of gold\nThey move\nThey're invisible\nThey talk\nThey're flat"
 *                   answer: ["c", "d", "c", "d", "b"]
 *                   solution:
 *                     - "There are four houses at Hogwarts."
 *                     - "Harry belongs to Gryffindor."
 *                     - "Defense Against the Dark Arts is the correct class."
 *                     - "Wizards fly using broomsticks."
 *                     - "The staircases at Hogwarts move on their own."
 *                 generation2:
 *                   title: "Harry's Magical World"
 *                   passage: "Harry’s world includes many magical creatures like house-elves, hippogriffs, and goblins.\nHe also plays Quidditch, a popular sport on flying broomsticks.\nHarry uses a wand to cast spells and carries an invisibility cloak that once belonged to his father.\nThe wizarding world also includes magical objects like the Marauder’s Map and the Mirror of Erised.\nThroughout the series, Harry learns about bravery, friendship, and sacrifice."
 *                   question:
 *                     - "What sport does Harry play?\nFootball\nBasketball\nQuidditch\nTennis\nWizard Chess"
 *                     - "What does Harry use to turn invisible?\nA magic ring\nA broomstick\nA potion\nAn invisibility cloak\nA mirror"
 *                     - "What magical map shows people’s locations?\nMap of Hogwarts\nMarauder’s Map\nWizard’s Compass\nElder Scroll\nDark Detector"
 *                     - "What magical creature does Harry befriend?\nUnicorn\nDragon\nHippogriff\nBasilisk\nThestral"
 *                     - "What lesson does Harry often learn?\nMath\nCooking\nSacrifice\nEngineering\nSwimming"
 *                   answer: ["c", "d", "b", "c", "c"]
 *                   solution:
 *                     - "Harry plays the sport called Quidditch."
 *                     - "He uses an invisibility cloak to hide."
 *                     - "The Marauder’s Map shows everyone’s location in Hogwarts."
 *                     - "Harry befriends a hippogriff named Buckbeak."
 *                     - "Harry learns important lessons about sacrifice and courage."
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
 *                 example: "Harry Potter"
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
 *                   example: "Harry Potter"
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
 * /api/text/test:
 *   get:
 *     summary: Test connection to FastAPI server
 *     tags: [Text]
 *     responses:
 *       200:
 *         description: Successfully connected to FastAPI server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: FastAPI server is reachable.
 *                 data:
 *                   type: object
 *       500:
 *         description: Failed to connect to FastAPI server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to reach FastAPI server.
 *                 error:
 *                   type: string
 */
router.get('/test', textController.testTextConnection);


router.post('/feedback', verifyToken, textController.saveFeedbackController);


router.get('/filter', textController.filterText);


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