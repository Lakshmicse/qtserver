const express = require('express');
const dispatcherController = require('../../controllers/dispatcher.controller');
require('../../middlewares/auth');
require('../../middlewares/validate');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');

const router = express.Router();
router.route('/').get(dispatcherController.getDispatcherList).post(dispatcherController.createDispatcher);
router
  .route('/:DispatcherId')
  .get(dispatcherController.getDispatcher)
  .patch(dispatcherController.updateDispatcher)
  .delete(dispatcherController.deleteDispatcher);

module.exports = router;
