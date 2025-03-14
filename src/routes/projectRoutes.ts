import { Router } from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
import { getApprovedProjects, getProjectOverview } from '../controllers/projectController';


const router = Router();
/**
 * @swagger
 * /api/projects/approved:
 *   get:
 *     summary: Get all approved projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of approved projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/projects/approved",jwtFilter,authorizeRoles([UserRole.ADMIN,UserRole.TEACHER,UserRole.STUDENT]),getApprovedProjects);

/**
 * @swagger
 * /api/project/overview/{id}:
 *   get:
 *     summary: Get project overview by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the project
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ProjectOverview'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

router.get("/project/overview/:id",jwtFilter,authorizeRoles([UserRole.ADMIN,UserRole.TEACHER,UserRole.STUDENT]),getProjectOverview);


export default router;