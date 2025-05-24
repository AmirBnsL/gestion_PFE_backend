import { Router } from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
import {
  getProjectSupervisionRequests,
  getTeacherProposedApprovedProjects,
  getTeacherSupervisedApprovedProjects,
} from '../controllers/teachersController';

const router = Router();
/**
 * @swagger
 * /api/teacher/{teacherId}/projects/proposed:
 *   get:
 *     summary: Retrieve proposed approved projects for a specific teacher
 *     description: Fetches all approved projects proposed by the specified teacher.
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         description: ID of the teacher whose proposed projects are to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of proposed approved projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */
router.get(
  '/teacher/:teacherId/projects/proposed',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  getTeacherProposedApprovedProjects,
);

/**
 * @swagger
 * /api/teacher/{teacherId}/projects/supervised:
 *   get:
 *     summary: Retrieve supervised approved projects for a specific teacher
 *     description: Fetches all approved projects supervised by the specified teacher.
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         description: ID of the teacher whose supervised projects are to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of supervised approved projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */
router.get(
  '/teacher/:teacherId/projects/supervised',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  //@ts-ignore
  getTeacherSupervisedApprovedProjects,
);

/**
 * @swagger
 * /api/teacher/projects/{projectId}/supervision/requests:
 *   get:
 *     summary: Retrieve supervision requests for a specific project
 *     description: Fetches all supervision requests for the specified project.
 *     tags:
 *       - Teachers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project whose supervision requests are to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of supervision requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SupervisionRequest'
 */
router.get(
  '/teacher/projects/:projectId/supervision/requests',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  getProjectSupervisionRequests,
);
