import { Router } from 'express';
import { UserRole } from '../entities/User';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import {
  createTask,
  getTasksByProjectId,
} from '../controllers/tasksController';

const router = Router();

/**
 * @swagger
 * /api/task:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 example: pending
 *               title:
 *                 type: string
 *                 example: New Task
 *               description:
 *                 type: string
 *                 example: Task description
 *               assignedTo:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 2, 3]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: medium
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-12-31T23:59:59.000Z
 *               projectId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error
 */

router.post(
  '/task',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  createTask,
);

/**
 * @swagger
 * /api/project/{projectId}/tasks:
 *   get:
 *     summary: Get tasks by project ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: number
 *         required: true
 *         description: The ID of the project
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tasks not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/project/:projectId/tasks',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  getTasksByProjectId,
);

export default router;
