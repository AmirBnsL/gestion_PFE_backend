import { Router } from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import {
  createTeam,
  getTeamByProjectId,
  requestTeam,
  sendInvite,
  acceptInvite,
  acceptJoinRequest,
  declineInvite,
  declineJoinRequest,
  createWishList,
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
 * /api/team/invite/{email}:
 *   post:
 *     summary: Invite a student to a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: email of the target student
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
  '/team/invite/:email',
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

/**
 * @swagger
 * /api/team/request/accept/{studentId}:
 *   post:
 *     summary: Accept a join request by a the team leader
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of request sender
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Request accepted successfully
 *       403:
 *         description: Unauthorized Or not team leader
 *
 */

router.post(
  '/team/request/accept/:studentId',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  acceptJoinRequest,
);

/**
 * @swagger
 * /api/team/invite/accept/{teamId}:
 *   post:
 *     summary: Accept an invitation to join a team
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
 *       200:
 *         description: Invitation accepted successfully
 *       404:
 *         description: Team not found
 *
 */

router.post(
  '/team/invite/accept/:teamId',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  acceptInvite,
);

/**
 * @swagger
 * /api/team/invite/reject/{teamId}:
 *   post:
 *     summary: Reject an invitation to join a team
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
 *       200:
 *         description: Invitation rejected successfully
 *       404:
 *         description: Team not found
 *
 */

router.post(
  '/team/invite/decline/:teamId',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  declineInvite,
);

/**
 * @swagger
 * /api/team/request/decline/{studentId}:
 *   post:
 *     summary: Decline a join request by a the team leader
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: id of request sender
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Request declined successfully
 *       403:
 *         description: Unauthorized Or not team leader
 *
 */

router.post(
  '/team/request/decline/:studentId',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  declineJoinRequest,
);

/**
 * @swagger
 * /api/team/wishlist:
 *   post:
 *     summary: Create a wishlist for a team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 project:
 *                   type: integer
 *                   description: The ID of the project
 *                 priority:
 *                   type: integer
 *                   description: The priority of the project in the wishlist
 *               required:
 *                 - project
 *                 - priority
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wish list created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post(
  '/team/wishlist',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  createWishList,
);

export default router;
