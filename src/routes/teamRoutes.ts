import { Router } from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import {
  createTeam,
  getTeamByProjectId,
  requestTeam,
  sendInvite,
} from '../controllers/teamController';
import { UserRole } from '../entities/User';

const router = Router();

/**
 * @swagger
 * /api/project/team/{projectId}:
 *   get:
 *     summary: Get team by project ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of team info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal server error
 */

router.get(
  '/project/team/:projectId',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  getTeamByProjectId,
);

/**
 * @swagger
 * /api/team:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Bad request
 */

router.post(
  '/team',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.STUDENT]),
  // @ts-ignore
  createTeam,
);

/**
 * @swagger
 * /api/team/invite:
 *   post:
 *     summary: Invite a student to a team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Invitation sent successfully
 *       403:
 *         description: Unauthorized Or not team leader
 *       404:
 *         description: Team not found
 *
 */

router.post(
  '/team/invite',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  sendInvite,
);

/**
 * @swagger
 * /api/team/request/{teamId}:
 *   post:
 *     summary: Request to join a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the team
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Request sent successfully
 *       404:
 *         description: Team not found
 *
 */

router.post(
  '/team/request/:teamId',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  requestTeam,
);

export default router;
