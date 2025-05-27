import express from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
import { paginationSchema, validateQuery } from '../middleware/validation';
import {
  getAllParameters,
  getMyParameter,
  getStudents,
  getTeachers,
  updateParameters,
} from '../controllers/adminController';

import { distributeProject } from '../controllers/projectController';

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

router.get(
  '/teachers',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  validateQuery(paginationSchema),
  getTeachers,
);

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

router.get(
  '/students',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  validateQuery(paginationSchema),
  getStudents,
);

/**
 * @swagger
 * /api/parameter:
 *   put:
 *     summary: Update parameters as an admin
 *     tags: [Parameters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maxTeamSize:
 *                 type: integer
 *                 example: 5
 *               allowTeamCreation:
 *                 type: boolean
 *                 example: true
 *               allowTeamJoining:
 *                 type: boolean
 *                 example: true
 *               allowWishListCreation:
 *                 type: boolean
 *                 example: true
 *               year:
 *                 type: string
 *                 enum: [FIRST_YEAR, SECOND_YEAR, THIRD_YEAR, FOURTH_YEAR, FIFTH_YEAR]
 *               distributionMode:
 *                 type:string
 *                 enum: [manual, automatic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Parameters updated successfully
 *       400:
 *         description: Invalid request body
 */

router.put(
  '/parameter',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  // @ts-ignore
  updateParameters,
);

/**
 * @swagger
 * /api/parameters:
 *   get:
 *     summary: Get all parameters as an admin
 *     tags: [Parameters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Parameter'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get(
  '/parameters',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  getAllParameters,
);

/**
 * @swagger
 * /api/me/parameter:
 *   get:
 *     summary: Get my year's parameters as an authenticated user
 *     tags: [Parameters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Parameter'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/me/parameter',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  // @ts-ignore
  getMyParameter,
);

router.post(
  '/project/distribute',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  // @ts-ignore
  distributeProject,
);
//TODO : Add admin interactions with parameters
export default router;
