
const express = require('express');
const brandController = require('../../controllers/brand.controller');
const auth = require('../../middlewares/auth'); // If needed for authentication/authorization
const upload = require('../../middlewares/upload-product-image'); // If needed for image upload

const router = express.Router();
router
  .route('/')
  .get(brandController.list)
  .post(upload.array('images[]', 10), brandController.create)
  .put(upload.array('images[]', 10), brandController.update);

router.route('/list').get( brandController.list);

router
  .route('/:brandId')
  .get(auth('getUsers'), brandController.get)
  .patch(auth('getUsers'), brandController.update)
  .delete(auth('getUsers'), brandController.deleteById);

router.route('/search/:searchId').get(auth('getUsers'), brandController.list);

module.exports = router;
