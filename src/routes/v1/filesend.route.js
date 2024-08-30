/* eslint-disable prettier/prettier */
const express = require('express');
const fileSendController = require('../../controllers/filesend.controller');
require('../../middlewares/auth');
require('../../middlewares/validate');
require('../../validations/user.validation');
require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const upload = require('../../middlewares/documentsharing');

const router = express.Router();
router.route('/').post(auth('getUsers'),fileSendController.createSendFile);

router.route('/fileupload').post(auth('getUsers'), upload.single('file'), fileSendController.uploadLogo);
router
  .route('/:DocumentId')
  .get(auth('getUsers'), fileSendController.getDocumentsByID)
  .patch(auth('getUsers'), fileSendController.updateDocuments)
  .delete(auth('getUsers'), fileSendController.deleteDocuments);
  router
  .route('/downloadfile/:DocumentId')
  .get( fileSendController.updateDocuments);
router.route('/documents/:searchId').get(auth('getUsers'), fileSendController.getDocumentsBySearch);
router.route('/received/:searchId').get(auth('getUsers'), fileSendController.getReceived);
router.route('/sent/:searchId').get(auth('getUsers'), fileSendController.getsent);
module.exports = router;
