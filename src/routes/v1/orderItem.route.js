const express = require('express');
const orderItemController = require('../../controllers/orderItem.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const router = express.Router();

// Route to get all order items or create a new order item
router
  .route('/')
  .get(auth('getOrderItems'), orderItemController.list)
  .post(auth('manageOrderItems'),  orderItemController.create);

// Route to get, update, or delete an order item by ID
router
  .route('/:orderItemId')
  .get(auth('getOrderItems'), orderItemController.get)
  .patch(auth('manageOrderItems'),orderItemController.update)
  .delete(auth('manageOrderItems'), orderItemController.deleteById);

module.exports = router;
