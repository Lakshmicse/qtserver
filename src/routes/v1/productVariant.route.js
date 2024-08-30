const express = require('express');
const variantController = require('../../controllers/productVariant.controller'); // Adjust the path as needed
const auth = require('../../middlewares/auth'); // Authentication middleware
const validate = require('../../middlewares/validate'); // Validation middleware
const upload = require('../../middlewares/upload-image');

const router = express.Router();

// Route to create a new variant
router
  .route('/')
  .post(upload.single('image'),variantController.createVariant); // Ensure authentication and validation

// Route to get all variants with optional filtering and pagination
router
  .route('/')
  .get(variantController.listVariantes); // Ensure authentication

// Route to get an variant by ID
router
  .route('/:variantId')
  .get(variantController.getVariantById); // Ensure authentication

// Route to update an variant by ID
router
  .route('/:variantId')
  .patch(variantController.updateVariantById); // Ensure authentication and validation

// Route to delete an variant by ID
router
  .route('/:variantId')
  .delete(variantController.deleteVariantById); // Ensure authentication

// Route to get all variants for a specific user
// router
//   .route('/user/:userId')
//   .get(auth('getUsers'), variantController.getVariantesByUserId); // Ensure authentication

module.exports = router;
