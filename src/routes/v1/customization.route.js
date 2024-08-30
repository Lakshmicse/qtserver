const express = require('express');
const customizationController = require('../../controllers/customization.controller');
const auth = require('../../middlewares/auth'); // Adjust path as needed
const validate = require('../../middlewares/validate'); // Adjust path as needed
const uploadMultiple = require('../../middlewares/upload-customization-images')
//const { createCategory, updateCategory } = require('../../validations/customization.validation'); // Adjust path as needed

const router = express.Router();

router
  .route('/')
  .post(auth('getUsers'),uploadMultiple,auth('getUsers'),customizationController.create) ;// Create a new customization
  // .get(customizationController.list); // List all categories

router
  .route('/:customizationId')
  .get(auth('getUsers'), customizationController.get) // Get a customization by ID
  .patch(auth('getUsers'),customizationController.update) // Update a customization by ID
  .delete(auth('getUsers'),customizationController.deleteById); // Delete a customization by ID

module.exports = router;
