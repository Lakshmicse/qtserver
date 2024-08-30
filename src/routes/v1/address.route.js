const express = require('express');
const addressController = require('../../controllers/address.controller'); // Adjust the path as needed
const auth = require('../../middlewares/auth'); // Authentication middleware
const validate = require('../../middlewares/validate'); // Validation middleware

const router = express.Router();

// Route to create a new address
router
  .route('/')
  .post(auth('getUsers'),addressController.createAddress); // Ensure authentication and validation

// Route to get all addresses with optional filtering and pagination
router
  .route('/')
  .get(auth('getUsers'),addressController.listAddresses); // Ensure authentication

// Route to get an address by ID
router
  .route('/:addressId')
  .get(auth('getUsers'), addressController.getAddressById); // Ensure authentication

// Route to update an address by ID
router
  .route('/:addressId')
  .patch(auth('getUsers'), addressController.updateAddressById); // Ensure authentication and validation

// Route to delete an address by ID
router
  .route('/:addressId')
  .delete(auth('getUsers'), addressController.deleteAddressById); // Ensure authentication

// Route to get all addresses for a specific user
router
  .route('/user/:userId')
  .get(auth('getUsers'), addressController.getAddressesByUserId); // Ensure authentication

module.exports = router;
