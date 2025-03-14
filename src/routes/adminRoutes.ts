import express from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
import { paginationSchema, validateQuery } from '../middleware/validation';
import {
  approveProject,
  getPendingApprovalProjects,
  getProjects,
  getStudents,
  getTeachers, rejectProject,
} from '../controllers/adminController';

const router = express.Router();


/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get all teachers as an admin
 *     tags: [Teachers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           example: 10
 *         required: true
 *         description: Number of items per page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/teachers', jwtFilter, authorizeRoles([UserRole.ADMIN]), validateQuery(paginationSchema), getTeachers);


/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students as an admin
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           example: 10
 *         required: true
 *         description: Number of items per page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get('/students', jwtFilter, authorizeRoles([UserRole.ADMIN]), validateQuery(paginationSchema), getStudents);


/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects as an admin
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           example: 10
 *         required: true
 *         description: Number of items per page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects
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


/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects as an admin
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           example: 10
 *         required: true
 *         description: Number of items per page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects
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


router.get('/projects', jwtFilter, authorizeRoles([UserRole.ADMIN]), validateQuery(paginationSchema), getProjects);

/**
 * @swagger
 * /api/projects/pending:
 *   get:
 *     summary: Get all prending projects as an admin
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           example: 10
 *         required: true
 *         description: Number of items per page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects
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


router.get('/projects/pending', jwtFilter, authorizeRoles([UserRole.ADMIN]), validateQuery(paginationSchema), getPendingApprovalProjects);

/**
 * @swagger
 * /api/project/approve/{id}:
 *   post:
 *     summary: Approve a project as an admin
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the project to approve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project has been approved
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

router.post('/project/approve/:id', jwtFilter, authorizeRoles([UserRole.ADMIN]), approveProject);

/**
 * @swagger
 * /api/project/reject/{id}:
 *   post:
 *     summary: Reject a project as an admin
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the project to reject
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project has been rejected
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.post('/project/reject/:id', jwtFilter, authorizeRoles([UserRole.ADMIN]),rejectProject);

export default router;