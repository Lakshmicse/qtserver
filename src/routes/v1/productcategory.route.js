const express = require('express');
const productCategoryController = require('../../controllers/productcategory.controller');
const auth = require('../../middlewares/auth'); // If authentication/authorization is needed
const upload = require('../../middlewares/upload-product-image'); // If image upload is needed

const router = express.Router();

// Route to list all categories and create a new category
router
  .route('/')
  .get(productCategoryController.list)
  .post(productCategoryController.create);

// Route to get a single category by ID, update a category by ID, and delete a category by ID
router
  .route('/:categoryId')
  .get(productCategoryController.get)
  .patch(productCategoryController.update)
  .delete(productCategoryController.deleteById);

module.exports = router;