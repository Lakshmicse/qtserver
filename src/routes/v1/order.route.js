const express = require('express');
const orderController = require('../../controllers/order.controller');
require('../../middlewares/auth');
require('../../middlewares/validate');
require('../../validations/user.validation');
require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const upload = require('../../middlewares/upload-product-image');

const router = express.Router();
router
  .route('/')
  .get(orderController.list)
  .post(auth('getUsers'),orderController.placeOrder);

router.route('/list').get( orderController.list);
router.route('/placeOrder').post( auth('getUsers'),orderController.placeOrder);

router
  .route('/:orderId')
  .get(auth('getUsers'), orderController.get)
  .patch(auth('getUsers'), orderController.update)
  .delete(auth('getUsers'), orderController.deleteById);

router.route('/search/:searchId').get(auth('getUsers'), orderController.list);

module.exports = router;
