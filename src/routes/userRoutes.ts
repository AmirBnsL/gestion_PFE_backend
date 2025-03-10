import express from 'express';
import { createUser, deleteUser, login } from '../controllers/userController';
import { userLoginSchema, userRegistrationSchema, validateData } from '../middleware/validation';
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Get all users
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *     responses:
 *       201:
 *         description: User has been created
 *       400:
 *         description: Error while creating user
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: login successful
 *       401:
 *         description: Invalid password
 *       409:
 *         description: Entity not found
 *       404:
 *         description: Bad request
 */



const router = express.Router();


router.post('/user', validateData(userRegistrationSchema), createUser);
router.delete('/user', deleteUser);
router.post('/login', validateData(userLoginSchema), login);
//router.get("/register", register);
//router.post("/student",register);
//router.post("/teacher",register); these are made by the admin
//admin has already an account and


export default router;