const express = require('express');
const manageTenantController = require('../../controllers/manage-tenant.controller');
require('../../middlewares/auth');
require('../../middlewares/validate');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.route('/').get(manageTenantController.getManageTenantList).post(manageTenantController.createManageTenant);
router.route('/user/:tenentId').get(manageTenantController.getManageTenantbyUser);
router
  .route('/:tenentId')
  .get(auth('getUsers'), manageTenantController.getManageTenant)
  .patch(auth('getUsers'), manageTenantController.updateManageTenant)
  .delete(auth('getUsers'), manageTenantController.deleteManageTenant);

module.exports = router;
