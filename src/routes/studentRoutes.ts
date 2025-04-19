import { Router } from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
import {
  getJoinRequests,
  getStudentInvites,
} from '../controllers/teamController';

const router = Router();

/**
 * @swagger
 * /api/student/invites:
 *   get:
 *     summary: Retrieve student invites
 *     description: Fetches all team invites for the currently authenticated student.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of team invites.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamInvite'
 *       400:
 *         description: Student not found.
 *       500:
 *         description: Internal server error.
 */

router.get(
  'student/invites',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  getStudentInvites,
);

/**
 * @swagger
 * /api/student/requests:
 *   get:
 *     summary: Retrieve student join requests
 *     description: Fetches all join requests for the currently authenticated student.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of join requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamJoinRequest'
 *       400:
 *         description: Student not found.
 *       500:
 *         description: Internal server error.
 */

router.get(
  'student/requests',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT]),
  // @ts-ignore
  getJoinRequests,
);

export default router;
