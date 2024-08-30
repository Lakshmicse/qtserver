const express = require('express');
const vehicleController = require('../../controllers/vehicle.controller');
require('../../middlewares/auth');
require('../../middlewares/validate');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');

const router = express.Router();
router.route('/').get(vehicleController.getVehicleList).post(vehicleController.createVehicle);
router
  .route('/:VehicleId')
  .get(vehicleController.getVehicle)
  .patch(vehicleController.updateVehicle)
  .delete(vehicleController.deleteVehicle);

module.exports = router;
