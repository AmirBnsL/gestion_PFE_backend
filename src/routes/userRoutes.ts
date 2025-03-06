import express from 'express';
import { getUser, createUser, deleteUser } from '../controllers/userController';
import { userRegistrationSchema, validateData } from '../middleware/validation';
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



const router = express.Router();

router.get('/user', getUser);
router.post('/user',validateData(userRegistrationSchema), createUser);
router.delete('/user', deleteUser);

//router.get("/login", login);
//router.get("/register", register);


export default router;