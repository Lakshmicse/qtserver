const express = require('express');
const auditLogController = require('../../controllers/auditlog.controller');

const router = express.Router();
router.route('/summery/:auditLogId').get(auditLogController.getSummery);
module.exports = router;
