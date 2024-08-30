/* eslint-disable prettier/prettier */
const express = require('express');
const auditlogController = require('../../controllers/auditlogonetime.controller');
const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');

const router = express.Router();

// router
//   .route('/')
//   .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);
router
  .route('/')
  .get(auth('getUsers'), auditlogController.getAuditLogs);
router
  .route('/:AuditLogId')
  .patch(auth('getUsers'), auditlogController.getAuditLog)
  .delete(auth('getUsers'), auditlogController.deleteAuditLog);
router.route('/search/:searchId').get(auth('getUsers'), auditlogController.getAuditLogBySearch);
router
  .route('/company/:companyId')
  .get(auth('getUsers'), auditlogController.getAuditLogByCompanyId)
  .patch(auth('getUsers'), auditlogController.deleteAuditLogByDate);;
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: LopDays
 *   description: Lop Management
 */

/**
 * @swagger
 * /lop-days:
 *   post:
 *     summary: Create a Lop days
 *     description: Lop creation
 *     tags: [LopDays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *         $ref: '#/components/requestBodies/LOPDays'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/LOPDays'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all lops
 *     description:  retrieve all lops.
 *     tags: [LopDays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LOPDays'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /lop-days/{lop-id}:
 *   get:
 *     summary: Get a Lop detail
 *     description: Lop detail description
 *     tags: [LopDays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lop-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lop id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/LOPDays'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a Lop detail
 *     description: Update a Lop.
 *     tags: [LopDays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lop-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lop id
 *     requestBody:
 *        $ref: '#/components/requestBodies/LOPDays'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/LOPDays'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a loan detail
 *     description: Delete a loan detail
 *     tags: [LopDays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lop-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lop  id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
