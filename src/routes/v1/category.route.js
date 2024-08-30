const express = require('express');
const categoryController = require('../../controllers/category.controller');
const auth = require('../../middlewares/auth'); // Adjust path as needed
const validate = require('../../middlewares/validate'); // Adjust path as needed
//const { createCategory, updateCategory } = require('../../validations/category.validation'); // Adjust path as needed

const router = express.Router();

router
  .route('/')
  .post(categoryController.create) // Create a new category
  .get(categoryController.list); // List all categories

router
  .route('/:categoryId')
  .get( categoryController.get) // Get a category by ID
  .patch(categoryController.update) // Update a category by ID
  .delete(categoryController.deleteById); // Delete a category by ID

module.exports = router;
