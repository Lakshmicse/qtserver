const express = require('express');
const cartController = require('../../controllers/cart.controller');
require('../../middlewares/auth');
require('../../middlewares/validate');
require('../../validations/user.validation');
require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const upload = require('../../middlewares/upload-product-image');

const router = express.Router();


router
  .route('/')
  .get(auth('getUsers'),cartController.list)
  .post(auth('getUsers'), cartController.create)
  //.put(auth('getUsers'), cartController.update);


router.route('/list').get( cartController.list);  
router.route('/:cartId').put( cartController.update);
router.route('/:cartId').delete( cartController.deleteById);


router
  .route(auth('getUsers'),'/:cartId')
  .get(auth('getUsers'), cartController.get)
  .patch(auth('getUsers'), cartController.update)
  .delete(auth('getUsers'), cartController.deleteById);

router.route('/search/:searchId').get(auth('getUsers'), cartController.list);

module.exports = router;
