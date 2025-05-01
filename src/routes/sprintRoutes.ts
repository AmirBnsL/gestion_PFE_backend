import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
import { Router } from 'express';
import {
  createSprint,
  getMySprints,
  getSprints,
} from '../controllers/sprintsController';

export const router = Router();

/**
 * @swagger
 * /api/sprint:
 *   post:
 *     summary: Create a new sprint
 *     tags:
 *       - Sprints
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-15"
 *               description:
 *                 type: string
 *                 example: "Sprint description"
 *               title:
 *                 type: string
 *                 example: "Sprint title"
 *               projectId:
 *                 type: integer
 *                 example: 1
 *               teamId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [On going, Not started, Completed]
 *                 example: "Not started"
 *     responses:
 *       201:
 *         description: Sprint created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Project or team not found
 *       500:
 *         description: Internal server error
 */

router.post(
  '/sprint',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  createSprint,
);

/**
 * @swagger
 * /api/me/sprints:
 *   get:
 *     summary: Retrieve sprints for the authenticated user
 *     tags:
 *       - Sprints
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sprints retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get(
  '/me/sprints',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  getMySprints,
);

/**
 * @swagger
 * /api/sprints/project/{projectId}/team/{teamId}:
 *   get:
 *     summary: Retrieve sprints for a specific project and team
 *     tags:
 *       - Sprints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the team
 *     responses:
 *       200:
 *         description: List of sprints retrieved successfully
 *       404:
 *         description: No sprints found
 *       500:
 *         description: Internal server error
 */

router.get(
  '/sprints/project/:projectId/team/:teamId',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT, UserRole.ADMIN, UserRole.TEACHER]),
  // @ts-ignore
  getSprints,
);
