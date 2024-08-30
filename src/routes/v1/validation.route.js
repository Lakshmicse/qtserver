const express = require('express');

const router = express.Router();

const loanDetailController = require('../../controllers/loan-detail.controller');
require('../../middlewares/auth');
require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
// const SchemaValidator = require('../../middlewares/SchemaValidator');

// const validateRequest = SchemaValidator(true);

// generic route handler
// const genericHandler = (req, res, next) => {
//   res.json({
//     status: 'success',
//     data: req.body,
//   });
// };

// // create a new teacher or student
// router.post('/people', validateRequest, genericHandler);

// // change auth credentials for teachers
// router.post('/auth/edit', validateRequest, genericHandler);

// // accept fee payments for students
// router.post('/fees/pay', validateRequest, genericHandler);

// const router = express.Router();
router.route('/').get(auth('getUsers'), loanDetailController.getLoanDetails).post(loanDetailController.createLoanDetail);
router.route('/joi').get(auth('getUsers'), loanDetailController.makeJoi);

router
  .route('/:loanDetailId')
  .get(auth('getUsers'), loanDetailController.getLoanDetail)
  .patch(auth('getUsers'), loanDetailController.updateLoanDetail)
  .delete(auth('getUsers'), loanDetailController.deleteLoanDetail);

module.exports = router;
