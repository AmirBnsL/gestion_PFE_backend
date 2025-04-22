import express from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
import { paginationSchema, validateQuery } from '../middleware/validation';
import { getStudents, getTeachers } from '../controllers/adminController';

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
  authorizeRoles([UserRole.ADMIN]),
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

//TODO : Add admin interactions with parameters
export default router;
