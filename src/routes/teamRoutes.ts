import { Router } from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { getTeamByProjectId } from '../controllers/teamController';
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

export default router;
