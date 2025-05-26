/**
 * GET /presentation-days: List all presentation days.
 * POST /presentation-days: Create a new presentation day.
 * GET /presentation-days/:id: Get details for a specific day.
 * PUT /presentation-days/:id: Update a presentation day.
 * POST /presentation-days/:id/slots: Add a slot to a day.
 * GET /presentation-days/:id/slots: List slots for a day.
 */

import { Router } from 'express';
import {
  createPresentationDay,
  getPresentationDays,
  getPresentationDayById,
  updatePresentationDay,
  addSlotToDay,
  getSlotsForDay,
  getPresentationsForJudge,
} from '../controllers/presentationDayController';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
const router = Router();

// Presentation Day Routes

/**
 * @swagger
 * tags:
 *   name: PresentationDays
 *   description: API endpoints for managing presentation days and slots.
 */

// Middleware to check JWT and roles
// List all presentation days

/**
 * @swagger
 * /api/presentationDays:
 *   get:
 *     tags:
 *       - PresentationDays
 *     summary: List all presentation days
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of presentation days
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PresentationDay'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/presentationDays',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  getPresentationDays,
);
// Create a new presentation day

//const { date, status, academicYear } = req.body;
//read the method body and make a swagger documentation for it
/**
 * @swagger
 * /api/presentationDay:
 *   post:
 *     tags:
 *       - PresentationDays
 *     summary: Create a new presentation day
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the presentation day
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 description: The status of the presentation day
 *               academicYear:
 *                 type: string
 *                 description: The academic year for the presentation day
 *     responses:
 *       201:
 *         description: Presentation day created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PresentationDay'
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/presentationDay',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  createPresentationDay,
);
// Get details for a specific presentation day
/**
 * @swagger
 * /api/presentationDay/{id}:
 *   get:
 *     tags:
 *       - PresentationDays
 *     summary: Get details for a specific presentation day
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the presentation day
 *     responses:
 *       200:
 *         description: Details of the specified presentation day
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PresentationDay'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/presentationDay/:id',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  getPresentationDayById,
);

// Update a presentation day
/**
 * @swagger
 * /api/presentationDay/{id}:
 *   put:
 *     tags:
 *       - PresentationDays
 *     summary: Update a presentation day
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the presentation day to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PresentationDay'
 *     responses:
 *       200:
 *         description: Presentation day updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PresentationDay'
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/presentationDay/:id',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  updatePresentationDay,
);
// Add a slot to a presentation day

/**
 * @swagger
 * /api/presentationDay/{id}/slots:
 *   post:
 *     tags:
 *       - PresentationDays
 *     summary: Add a slot to a presentation day
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the presentation day to add a slot to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: The start time of the slot
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: The end time of the slot
 *               room:
 *                 type: string
 *                 description: The room for the slot
 *     responses:
 *       201:
 *         description: Slot added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PresentationSlot'
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/presentationDay/:id/slots',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  addSlotToDay,
);
// List slots for a specific presentation day
/**
 * @swagger
 * /api/presentationDay/{id}/slots:
 *   get:
 *     tags:
 *       - PresentationDays
 *     summary: List slots for a specific presentation day
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the presentation day to list slots for
 *     responses:
 *       200:
 *         description: A list of slots for the specified presentation day
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PresentationSlot'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/presentationDay/:id/slots',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  getSlotsForDay,
);

/**
 * @swagger
 * /api/teacher/presentationDays:
 *   get:
 *     tags:
 *       - PresentationDays
 *     summary: Get presentations for a judge
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of presentations for the judge
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Presentation'
 *       401:
 *         description: Unauthorized
 */

router.get(
  '/teacher/presentationDays',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  getPresentationsForJudge,
);
export default router;
export { router as presentationDayRoutes };
