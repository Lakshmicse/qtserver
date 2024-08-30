const express = require('express');
const driverController = require('../../controllers/driver.controller');
require('../../middlewares/auth');
require('../../middlewares/validate');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');

const router = express.Router();
router.route('/').get(driverController.getDriverList).post(driverController.createDriver);
router
  .route('/:DriverId')
  .get(driverController.getDriver)
  .patch(driverController.updateDriver)
  .delete(driverController.deleteDriver);
  module.exports = router;

