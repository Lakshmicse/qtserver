const express = require('express');
const downloadExcelController = require('../../controllers/downloadExcel.controller');
require('../../middlewares/auth');
const auth = require('../../middlewares/auth');

const router = express.Router();
// router.route('/downloadExcelAll/download-excel/:companyId').get(auth('getUsers'), downloadExcelController.downloadexcelall);
router
  .route('/downloadExcelThismonth/download-excel/:companyId')
  .get(auth('getUsers'), downloadExcelController.downloadexcelthisMonth);

// router.route('/downloadExcelThismonth/download-greytip/:companyId').get(downloadExcelController.downloadexcelthisMonth);
router
  .route('/downloadExcelSelectMonth/download-excel/:companyId')
  .get(auth('getUsers'), downloadExcelController.downloadexcelselectMonth);
router.route('/lockrecords/:companyId').get(auth('getUsers'), downloadExcelController.LockselectMonth);
router.route('/getfileslist').get(auth('getUsers'), downloadExcelController.getGreytipFilesList);
router.route('/getfileslist/files').get(auth('getUsers'), downloadExcelController.getGreytipFiles);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee management and retrieval
 */

/**
 *  @swagger
 *  /employee:
 *    post:
 *     summary: Create a Employee
 *     description: Only logged in user can create  Employees.
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *         $ref: '#/components/requestBodies/Employee'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Employee'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmployee'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */
/**
 *  @swagger
 *  /employee/{EmployeeId}:
 *    patch:
 *     summary: Update a Employee
 *     description: Only logged in user can update other Employees.
 *     parameters:
 *       - in: path
 *         name: EmployeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee id
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *         $ref: '#/components/requestBodies/Employee'
 *     responses:
 *       "201":
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Employee'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmployee'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/**
 * @swagger
 * /employee/{EmployeeId}:
 *   get:
 *     summary: Get a Employee
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: EmployeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Employee'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a Employee
 *     description:  HR can delete Employees.
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: EmployeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee Id
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

/**
 * @swagger
 * /employee/company/{CompanyId}:
 *   get:
 *    summary: Get a Employees
 *    description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *    tags: [Employee]
 *    security:
 *       - bearerAuth: []
 *    parameters:
 *        - in: path
 *          name: CompanyId
 *          required: true
 *          schema:
 *           type: string
 *          description: Company Id id
 *        - in: query
 *          name: status
 *          description: pass an optional search string for looking up employees
 *          required: false
 *          schema:
 *          type: string
 *    responses:
 *       200:
 *         description: search results matching criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *           application/xml:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       400:
 *         description: bad input parameter
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
