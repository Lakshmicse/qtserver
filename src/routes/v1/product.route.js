const express = require('express');
const productController = require('../../controllers/product.controller');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload-product-image');

const router = express.Router();

// Route to list all products and create a product
router
  .route('/')
  .get(productController.list)
  .put(auth('getUsers'), upload.array('images[]', 10), productController.create);

// Route to get, update, and delete a product by ID
router
  .route('/:productId')
  .get(auth('getUsers'), productController.get)
  .patch(auth('getUsers'), productController.update)
  .delete(auth('getUsers'), productController.deleteById);

// Route to list all products (this is redundant with the route '/')
router.route('/list').get(auth('getUsers'), productController.list);

// Route to search for products by searchId
router.route('/search/:searchId').get(auth('getUsers'), productController.list);

module.exports = router;
