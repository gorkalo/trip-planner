/**
 * @swagger
 * tags:
 *   - name: Trips
 *     description: Get specific trip options sorted by client criteria 
 * /api/trip:
 *   get:
 *     summary: Returns trip options based on client criteria
 *     tags: [Trips]
 *     parameters:
 *       - name: origin
 *         in: query
 *         description: Trip origin
 *         required: true
 *         schema:
 *           type: string
 *       - name: destination
 *         in: query
 *         description: Trip destination
 *         required: true
 *         schema:
 *           type: string
 *       - name: sort_by
 *         in: query
 *         description: Sort by field
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   origin:
 *                     type: string
 *                     example: SYD
 *                   destination:
 *                     type: string
 *                     example: GRU
 *                   cost:
 *                     type: number
 *                     example: 625
 *                   duration:
 *                     type: number
 *                     example: 5
 *                   type:
 *                     type: string
 *                     example: flight
 *                   id:
 *                     type: string
 *                     example: a749c866-7928-4d08-9d5c-a6821a583d1a
 *                   display_name:
 *                     type: string
 *                     example: from SYD to GRU by flight
 * /api/save-trip:
 *   post:
 *     summary: Returns the id of the saved trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip_id:
 *                 type: string
 *                 description: Trip unique id
 *                 example: a749c866-7928-4d08-9d5c-a6821a583d1a
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trip_id:
 *                   type: string
 *                   example: a749c866-7928-4d08-9d5c-a6821a583d1a
 * 
 * /api/saved-trips:
 *   get:
 *     summary: Returns saved trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                  origin:
 *                    type: string
 *                    example: SYD
 *                  destination:
 *                    type: string
 *                    example: GRU
 *                  cost:
 *                    type: number
 *                    example: 625
 *                  duration:
 *                    type: number
 *                    example: 5
 *                  type:
 *                    type: string
 *                    example: flight
 *                  id:
 *                    type: string
 *                    example: a749c866-7928-4d08-9d5c-a6821a583d1a
 *                  display_name:
 *                    type: string
 *                    example: from SYD to GRU by flight
 * 
 * /api/delete-trip:
 *   delete:
 *     summary: Returns the id of the deleted trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip_id:
 *                 type: string
 *                 description: Trip unique id
 *                 example: a749c866-7928-4d08-9d5c-a6821a583d1a
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trip_id:
 *                   type: string
 *                   example: a749c866-7928-4d08-9d5c-a6821a583d1a
 * 
 */

module.exports = {};
