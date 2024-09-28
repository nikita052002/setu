const express = require ("express");
const healthInsuranceController = require('../../controllers/user/healthInsurance');
const router = express.Router();

/**
 * @swagger
 * /api/users/insurance-types:
 *   get:
 *     summary: Retrieve all insurance types
 *     tags:
 *       - User Health Insurance
 *     responses:
 *       200:
 *         description: A list of insurance types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the insurance type
 *                   type_name:
 *                     type: string
 *                     description: The name of the insurance type
 *                   description:
 *                     type: string
 *                     description: A description of the insurance type
 *       500:
 *         description: Internal Server Error
 */
router.get('/insurance-types',healthInsuranceController.getAllInsuranceTypes);

/**
 * @swagger
 * /api/users/age-groups:
 *   get:
 *     summary: Retrieve all Age Groups
 *     tags:
 *       - User Health Insurance
 *     responses:
 *       200:
 *         description: A list of age groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the age groups
 *                   type_name:
 *                     type: string
 *                     description: The name of the age groups
 *                   description:
 *                     type: string
 *                     description: A description of the age groups
 *       500:
 *         description: Internal Server Error
 */
router.get('/age-groups',healthInsuranceController.getAllAgeGroups);

/**
 * @swagger
 * /api/users/cover-amounts:
 *   get:
 *     summary: Retrieve all cover amounts
 *     tags:
 *       - User Health Insurance
 *     responses:
 *       200:
 *         description: A list of cover amounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status of the request
 *                   example: true
 *                 coverAmounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the cover amount
 *                       amount:
 *                         type: number
 *                         description: The cover amount value
 *                       age_group_id:
 *                         type: integer
 *                         description: ID of the age group the cover amount belongs to
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/cover-amounts',healthInsuranceController.getAllCoverAmount);

/**
 * @swagger
 * /api/users/insurer:
 *   get:
 *     summary: Retrieve all insurers
 *     tags:
 *       - User Health Insurance
 *     responses:
 *       200:
 *         description: A list of insurers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status of the request
 *                   example: true
 *                 insurers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the insurer
 *                       name:
 *                         type: string
 *                         description: The name of the insurer
 *                       description:
 *                         type: string
 *                         description: The description of the insurer
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/insurer',healthInsuranceController.getAllInsurer);
/**
 * @swagger
 * /api/users/user-details:
 *   post:
 *     summary: Add user details
 *     tags: 
 *       - User Health Insurance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *                 description: The full name of the user.
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *                 example: Male
 *                 description: The gender of the user (either Male or Female).
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-15
 *                 description: The user's date of birth in YYYY-MM-DD format.
 *               mobile_no:
 *                 type: string
 *                 example: '1234567890'
 *                 description: The user's mobile number.
 *               email:
 *                 type: string
 *                 example: john@example.com
 *                 description: The user's email address.
 *     responses:
 *       201:
 *         description: User details added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User details added successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The unique identifier for the user.
 *                     full_name:
 *                       type: string
 *                       description: The full name of the user.
 *                     gender:
 *                       type: string
 *                       description: The gender of the user.
 *                     date_of_birth:
 *                       type: string
 *                       description: The date of birth of the user.
 *                     mobile_no:
 *                       type: string
 *                       description: The mobile number of the user.
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                     status:
 *                       type: string
 *                       description: The status of the user (default is 'active').
 *       400:
 *         description: Bad Request, indicating validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Full name is required.
 *       500:
 *         description: An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while adding user details.
 *                 error:
 *                   type: object
 *                   description: Detailed error information.
 */

router.post('/user-details',healthInsuranceController.addUserDetails);
/**
 * @swagger
 * /api/users/user-details/{id}:
 *   put:
 *     summary: Update user details
 *     tags: 
 *       - User Health Insurance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *                 example: Male
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-15
 *               mobile_no:
 *                 type: string
 *                 example: '1234567890'
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User details updated successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The unique identifier for the user.
 *                     full_name:
 *                       type: string
 *                       description: The full name of the user.
 *                     gender:
 *                       type: string
 *                       description: The gender of the user.
 *                     date_of_birth:
 *                       type: string
 *                       description: The date of birth of the user.
 *                     mobile_no:
 *                       type: string
 *                       description: The mobile number of the user.
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                     status:
 *                       type: string
 *                       description: The status of the user (e.g., active).
 *       400:
 *         description: Bad Request, indicating validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID is required.
 *       500:
 *         description: An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating user details.
 *                 error:
 *                   type: object
 */


router.put('/user-details/:id',healthInsuranceController.updateUserDetails);
module.exports = router;