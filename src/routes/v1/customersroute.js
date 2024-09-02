const express = require('express');
const customerscontrollerr = require('../../controllers/customerscontrollerr');
require('../../middlewares/auth');
require('../../middlewares/validate');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');

const router = express.Router();
router.route('/').get(customerscontrollerr.getcusDriverList).post(customerscontrollerr.createcusDriver);
router
  .route('/:CustomerDriverId')
  .get(customerscontrollerr.getcusDriver)
  .patch(customerscontrollerr.updatecusDriver)
  .delete(customerscontrollerr.deletecusDriver);
  module.exports = router;
