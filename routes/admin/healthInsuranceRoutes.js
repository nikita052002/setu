const express = require('express');
const router = express.Router();
const insuranceController = require('../../controllers/admin/addHealthInsurance');
/**
 * @swagger
 * /api/admin/insurance-types:
 *   post:
 *     summary: Create a new insurance type
 *     tags:
 *       - Admin Health Insurance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the insurance type
 *                 example: Health Insurance
 *     responses:
 *       201:
 *         description: Insurance Type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Insurance Type created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the created insurance type
 *                       example: 1
 *                     name:
 *                       type: string
 *                       description: The name of the insurance type
 *                       example: Health Insurance
 *       400:
 *         description: Bad Request - Missing required fields
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
 *                   example: Insurance name is required
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
router.post('/insurance-types',insuranceController.createInsuranceTypes);
/**
 * @swagger
 * /api/admin/insurance-types/{id}:
 *   put:
 *     summary: Update an existing insurance type
 *     tags:
 *       - Admin Health Insurance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the insurance type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the insurance type
 *                 example: Updated Insurance Name
 *               status:
 *                 type: string
 *                 description: Status of the insurance type (active or inactive)
 *                 example: active
 *     responses:
 *       200:
 *         description: Insurance Type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Insurance Type updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Updated Insurance Name
 *                     status:
 *                       type: string
 *                       example: active
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-09-22T12:34:56.789Z
 *       400:
 *         description: Bad Request - Missing required fields
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
 *                   example: Insurance name is required
 *       404:
 *         description: Insurance Type not found
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
 *                   example: Insurance Type not found
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
router.put('/insurance-types/:id',insuranceController.updateInsuranceTypesController);
/**
 * @swagger
 * /api/admin/age-groups:
 *   post:
 *     summary: Create a new age group
 *     tags:
 *       - Admin Health Insurance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               range:
 *                 type: string
 *                 description: The range of ages (e.g., '18-25', '26-35')
 *                 example: '18-25'
 *     responses:
 *       201:
 *         description: Age Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Age Group created successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     range:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: 'Active'
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request
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
 *                   example: 'Age range is required'
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
 *                   example: 'Internal Server Error'
 */

router.post('/age-groups',insuranceController.createAgeGroup);
/**
 * @swagger
 * /api/admin/age-groups/{id}:
 *   put:
 *     summary: Update an age group
 *     tags:
 *       - Admin Health Insurance
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the age group to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               range:
 *                 type: string
 *                 description: The range of ages (e.g., '18-25', '26-35')
 *                 example: '18-25'
 *               status:
 *                 type: string
 *                 description: The status of the age group (e.g., 'Active', 'Inactive')
 *                 example: 'Active'
 *     responses:
 *       200:
 *         description: Age Group updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Age Group updated successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     range:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: 'Active'
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Age Group not found
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
 *                   example: 'Age Group not found.'
 *       400:
 *         description: Bad Request
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
 *                   example: 'No fields provided for update.'
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
 *                   example: 'Internal Server Error'
 */

router.put('/age-groups/:id', insuranceController.updateAgeGroup);
/**
 * @swagger
 * /api/admin/cover-amounts:
 *   post:
 *     summary: Create a cover amount
 *     tags:
 *       - Admin Health Insurance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age_group_id:
 *                 type: integer
 *                 description: ID of the age group
 *               insurance_type_id:
 *                 type: integer
 *                 description: ID of the insurance type
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Cover amount value
 *     responses:
 *       201:
 *         description: Cover amount created successfully
 *       400:
 *         description: Bad request, missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insurance type ID, Age group ID, and amount are required.
 *       404:
 *         description: Not Found, insurance_type_id or age_group_id not found in respective tables
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: >
 *                     Insurance type ID not found or Age group ID not found.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/cover-amounts',insuranceController.createCoverAmountController);
/**
 * @swagger
 * /api/admin/cover-amounts/{id}:
 *   put:
 *     summary: Update a cover amount
 *     tags:
 *       - Admin Health Insurance
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the cover amount to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age_group_id:
 *                 type: integer
 *               insurance_type_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Cover amount updated successfully
 *       400:
 *         description: Bad request, missing or invalid fields
 *       404:
 *         description: Cover amount not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/cover-amounts/:id',insuranceController.updateCoverAmountController);
/**
 * @swagger
 * /api/admin/insurers:
 *   post:
 *     summary: Create an insurer
 *     tags:
 *       - Admin Health Insurance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - insurance_type_id
 *               - age_group_id
 *               - monthly_rate
 *               - annually_rate
 *             properties:
 *               insurance_type_id:
 *                 type: integer
 *                 description: ID of the insurance type
 *                 example: 1
 *               age_group_id:
 *                 type: integer
 *                 description: ID of the age group
 *                 example: 2
 *               monthly_rate:
 *                 type: number
 *                 format: float
 *                 description: Monthly insurance rate
 *                 example: 50.0
 *               annually_rate:
 *                 type: number
 *                 format: float
 *                 description: Annual insurance rate
 *                 example: 500.0
 *               monthly_benefit1:
 *                 type: string
 *                 description: Description of the first benefit for the monthly plan
 *               monthly_benefit2:
 *                 type: string
 *                 description: Description of the second benefit for the monthly plan
 *               annually_benefit1:
 *                 type: string
 *                 description: Description of the first benefit for the annual plan
 *               annually_benefit2:
 *                 type: string
 *                 description: Description of the second benefit for the annual plan
 *     responses:
 *       201:
 *         description: Insurer created successfully
 *       400:
 *         description: Bad request, missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required.
 *       404:
 *         description: Not Found, insurance_type_id or age_group_id not found in respective tables
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insurance type ID not found. Age group ID not found.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/insurers',insuranceController.createInsurerController);
/**
 * @swagger
 * /api/admin/insurers/{id}:
 *   put:
 *     summary: Update an insurer
 *     tags:
 *       - Admin Health Insurance
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the insurer to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               insurance_type_id:
 *                 type: integer
 *               age_group_id:
 *                 type: integer
 *               monthly_rate:
 *                 type: number
 *                 format: float
 *               annually_rate:
 *                 type: number
 *                 format: float
 *               monthly_benefit1:
 *                 type: string
 *               monthly_benefit2:
 *                 type: string
 *               annually_benefit1:
 *                 type: string
 *               annually_benefit2:
 *                 type: string
 *     responses:
 *       200:
 *         description: Insurer updated successfully
 *       400:
 *         description: Bad request, missing or invalid fields
 *       404:
 *         description: Insurer not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/insurers/:id',insuranceController.updateInsurer);


module.exports = router;