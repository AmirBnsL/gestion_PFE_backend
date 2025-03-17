import { Router } from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
import { getAnnouncments, publishAnnouncement } from '../controllers/announcementsController';


const router = Router();

/**
 * @swagger
 * /api/announcement:
 *   post:
 *     summary: Publish an announcement as an admin
 *     tags: [Announcements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Announcement"
 *               body:
 *                 type: string
 *                 example: "This is the body of the announcement."
 *               audience:
 *                 type: string
 *                 enum: [STUDENTS, TEACHERS, ALL]
 *                 example: "ALL"
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: "HIGH"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Announcement has been published
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


router.post("/announcement",jwtFilter,authorizeRoles([UserRole.ADMIN]),publishAnnouncement);




/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: Retrieve a list of announcements
 *     tags: [Announcements]
 *     parameters:
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         required: true
 *         description: Number of announcements to retrieve
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: Page number to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Announcement'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/announcements",jwtFilter,authorizeRoles([UserRole.ADMIN,UserRole.STUDENT,UserRole.TEACHER]),getAnnouncments);
export default router;