import { Router } from 'express';
import {
  createSupervisionRequest,
  updateSupervisionRequestStatus,
  getSupervisionRequestById,
  listSupervisionRequests,
} from '../controllers/supervisionRequestController';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';

/**
 * @swagger
 * tags:
 *   name: SupervisionRequests
 *   description: Supervision request management
 */

const router = Router();

/**
 * @swagger
 * /api/supervision-requests:
 *   post:
 *     summary: Create a new supervision request
 *     tags: [SupervisionRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: integer
 *               supervisorId:
 *                 type: integer
 *               projectId:
 *                 type: integer
 *               direction:
 *                 type: string
 *                 enum: [TEAM_TO_SUPERVISOR, SUPERVISOR_TO_TEAM]
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Missing fields
 *       409:
 *         description: Request already exists
 */
router.post(
  '/supervision-requests',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT, UserRole.TEACHER]),
  // @ts-ignore
  createSupervisionRequest,
);

/**
 * @swagger
 * /api/supervision-requests/{id}/status:
 *   patch:
 *     summary: Update a supervision request status (accept/reject/validate)
 *     tags: [SupervisionRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected, validated_by_proposer]
 *               decidedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Invalid status transition
 *       403:
 *         description: Forbidden
 */
router.patch(
  '/supervision-requests/:id/status',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT, UserRole.TEACHER]),
  // @ts-ignore
  updateSupervisionRequestStatus,
);

/**
 * @swagger
 * /api/supervision-requests/{id}:
 *   get:
 *     summary: Get a supervision request by id
 *     tags: [SupervisionRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The supervision request
 *       404:
 *         description: Not found
 */
router.get(
  '/supervision-requests/:id',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN]),
  getSupervisionRequestById,
);

/**
 * @swagger
 * /api/supervision-requests:
 *   get:
 *     summary: List supervision requests
 *     tags: [SupervisionRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teamId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: supervisorId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of supervision requests
 */
router.get(
  '/supervision-requests',
  jwtFilter,
  authorizeRoles([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN]),
  listSupervisionRequests,
);

export default router;
