const express = require('express');
const companyController = require('../../controllers/company.controller');
require('../../middlewares/auth');
require('../../middlewares/validate');
require('../../validations/user.validation');
require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const upload = require('../../middlewares/upload-image');

const router = express.Router();
router
  .route('/')
  .get(auth('getUsers'), companyController.getCompanies)
  .post(auth('getUsers'), companyController.createCompany);

router.route('/upload-logo').post(upload.single('file'), companyController.uploadLogo);

router
  .route('/:companyId')
  .get(auth('getUsers'), companyController.getCompany)
  .patch(auth('getUsers'), companyController.updateCompany)
  .delete(auth('getUsers'), companyController.deleteCompany);

router.route('/search/:searchId').get(auth('getUsers'), companyController.getCompanyBySearch);
router.route('/payrollcalender/:companyId').get(auth('getUsers'), companyController.getPayrollCompany);
router
  .route('/payrollcalenderpreviousyear/:companyId')
  .get(auth('getUsers'), companyController.getPayrollCompanypreviousyear);
module.exports = router;
