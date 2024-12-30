/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
 * /api/signup:
 *   post:
 *     summary: Returns the created user email and auth token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Created user email and auth token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: example@example.com
 *                 token:
 *                   type: string
 * /api/login:
 *   post:
 *     summary: Returns the authenticated user token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Authenticated user email and auth token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: example@example.com
 *                 token:
 *                   type: string
 */

module.exports = {};