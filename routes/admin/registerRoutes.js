const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const { adminAuthMiddleware, roleMiddleware } = require('../../middlewares/authMiddleware');
/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin123"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongpassword"
 *               role:
 *                 type: string
 *                 example: "superadmin"
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin registered successfully"
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                       example: "admin123"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *                     role:
 *                       type: string
 *                       example: "superadmin"
 *       400:
 *         description: Bad request (validation or server error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is already registered"
 */
router.post('/register', adminController.registerAdmin); // Registration doesn't require auth
/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Log in an admin
 *     tags:
 *       - Admin
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
 *         description: Admin logged in successfully
 *       400:
 *         description: Bad request
 */
router.post('/login', adminController.loginAdmin); // Login doesn't require auth

/**
 * @swagger
 * /api/admin/list:
 *   get:
 *     summary: Retrieve a list of all admins (only accessible by superadmin)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []  # Bearer token authentication
 *     responses:
 *       200:
 *         description: A list of all admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                     example: superadmin
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token, authorization denied"
 *       403:
 *         description: Forbidden (insufficient permissions)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access denied: insufficient permissions only superadmin can access"
 */

router.get('/list', adminAuthMiddleware, roleMiddleware(['superadmin']), adminController.getAllAdmins); // Only 'superadmin' can access

module.exports = router;
