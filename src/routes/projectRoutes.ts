import { Router } from 'express';
import { authorizeRoles, jwtFilter } from '../middleware/authJwt';
import { UserRole } from '../entities/User';
import {
  assignProjectToTeam,
  createProject,
  getApprovedProjects,
  getProjectOverview,
  sendProjectSupervisionByProject,
  sendProjectSupervisionByTeacher,
  acceptProjectSupervisionInviteAsTeacher,
  acceptProjectSupervisionInviteAsProposer,
  getTeamJoinProjectRequestsForProject,
  acceptTeamProjectRequest,
  declineTeamProjectRequest,
  uploadProjectFile,
  getProjectFilesLink,
  downloadFileById,
  deleteProject,
  rejectProjectSupervisionInviteAsTeacher,
} from '../controllers/projectController';
import {
  paginationSchema,
  projectCreationSchema,
  validateBody,
  validateQuery,
} from '../middleware/validation';
import {
  approveProject,
  getPendingApprovalProjects,
  getProjects,
  rejectProject,
} from '../controllers/adminController';
import multer from 'multer';
import { Request, Response } from 'express';
import path from 'path';
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

router.get(
  '/projects/approved',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  getApprovedProjects,
);

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

router.get(
  '/project/overview/:id',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]),
  getProjectOverview,
);

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

router.get(
  '/projects',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  validateQuery(paginationSchema),
  getProjects,
);

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

router.get(
  '/projects/pending',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  validateQuery(paginationSchema),
  getPendingApprovalProjects,
);

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

router.post(
  '/project/approve/:id',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  // @ts-ignore
  approveProject,
);

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
router.post(
  '/project/reject/:id',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  rejectProject,
);

/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               specialty :
 *                 type: string
 *               academicYear:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Project has been created
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/project',
  validateBody(projectCreationSchema),
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  createProject,
);

/**
 * @swagger
 * /api/project/assign:
 *   post:
 *     summary: Assign a project to a team
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: number
 *               teamId:
 *                 type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project has been assigned to the team
 *
 *       400:
 *         description: Specialty mismatch
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/project/assign',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN]),
  // @ts-ignore
  assignProjectToTeam,
);

/**
 * @swagger
 * /api/project/supervise/request/{projectId}:
 *   post:
 *     summary: Send a supervision request for a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project to supervise
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supervision request sent successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/project/supervise/request/:projectId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  sendProjectSupervisionByProject,
);

/**
 * @swagger
 * /api/project/{projectId}/supervise/invite/{teacherId}:
 *   post:
 *     summary: Invite a teacher to supervise a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project to invite a teacher for supervision
 *         schema:
 *           type: integer
 *       - in: path
 *         name: teacherId
 *         required: true
 *         description: ID of the teacher to invite for supervision
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supervision invite sent successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/project/:projectId/supervise/invite/:teacherId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  sendProjectSupervisionByTeacher,
);

/**
 * @swagger
 * /api/project/supervise/invite/accept/{requestId}:
 *   post:
 *     summary: Accept a supervision invite as a teacher
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the supervision invite request
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supervision invite accepted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/project/supervise/invite/accept/:requestId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  acceptProjectSupervisionInviteAsTeacher,
);

router.post(
  '/project/supervise/invite/reject/:requestId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  rejectProjectSupervisionInviteAsTeacher,
);
/**
 * @swagger
 * /api/project/supervise/request/accept/{requestId}:
 *   post:
 *     summary: Accept a supervision invite as a proposer
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the supervision invite request
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supervision invite accepted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/project/supervise/request/accept/:requestId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  acceptProjectSupervisionInviteAsProposer,
);

/**
 * @swagger
 * /api/project/{projectId}/team/requests:
 *   get:
 *     summary: Get team join project requests for a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project to get team join requests for
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of team join project requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamJoinProjectRequest'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */

router.get(
  '/project/:projectId/team/requests',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  getTeamJoinProjectRequestsForProject,
);

/**
 * @swagger
 * /api/project/team/request/accept/{requestId}:
 *   post:
 *     summary: Accept a team join project request
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the team join project request
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: request accepted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/project/team/request/accept/:requestId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  acceptTeamProjectRequest,
);

/**
 * @swagger
 * /api/project/team/request/decline/{requestId}:
 *   post:
 *     summary: Decline a team join project request
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the team join project request
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: request declined successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/project/team/request/decline/:requestId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  declineTeamProjectRequest,
);

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb: any) {
    const projectRoot = path.resolve(__dirname, '../../');
    cb(null, projectRoot + '/uploads/projectFiles'); // 1st arg = error (null means no error), 2nd = folder
  },
  filename: function (req: Request, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // 1st arg = error, 2nd = new file name
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/project/file/{projectId}:
 *   post:
 *     summary: Upload files for a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project to uploads files for
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/project/file/:projectId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  upload.array('files'),
  // @ts-ignore
  uploadProjectFile,
);

/**
 * @swagger
 * /api/project/file/{projectId}:
 *   get:
 *     summary: Download files for a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project to download files for
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */

router.get(
  '/project/file/:projectId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  getProjectFilesLink,
);

/**
 * @swagger
 * /api/project/file/download/{fileId}:
 *   get:
 *     summary: Download a file by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         description: ID of the file to download
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/project/file/download/:fileId',
  jwtFilter,
  authorizeRoles([UserRole.TEACHER]),
  // @ts-ignore
  downloadFileById,
);

router.delete(
  '/project/:projectId',
  jwtFilter,
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  // @ts-ignore
  deleteProject,
);
export default router;
