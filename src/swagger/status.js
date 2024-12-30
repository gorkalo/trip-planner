/**
 * @swagger
 * tags:
 *   - name: Status
 *     description: Status of the API
 * /api/ping:
 *   get:
 *     summary: Returns a pong message to ensure the API is running
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: pong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: pong
 */

module.exports = {};