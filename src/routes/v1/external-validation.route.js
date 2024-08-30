const express = require('express');
const externalValidationController = require('../../controllers/external-validation.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.route('/pan/:PAN').get(auth('getUsers'), externalValidationController.validatePan);
router.route('/gstn/:GSTN').get(auth('getUsers'), externalValidationController.validateGstn);
router.route('/aadhaar/:aadhaar').get(auth('getUsers'), externalValidationController.validateAadhaar);

module.exports = router;
