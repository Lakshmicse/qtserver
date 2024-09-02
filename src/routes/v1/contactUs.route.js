const express = require('express');
const contactUsController = require('../../controllers/contactus.controller');
const auth = require('../../middlewares/auth'); // Adjust path as needed
const validate = require('../../middlewares/validate'); // Adjust path as needed
// const { createContactUs, updateContactUs } = require('../../validations/contactUs.validation'); // Adjust path as needed

const router = express.Router();

router
  .route('/')
  .post(contactUsController.create) // Create a new contact submission
  .get(contactUsController.list); // List all contact submissions

router
  .route('/:contactUsId')
  .get(contactUsController.get) // Get a contact submission by ID
  .patch(contactUsController.update) // Update a contact submission by ID
  .delete(contactUsController.deleteById); // Delete a contact submission by ID

module.exports = router;
