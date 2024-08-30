const express = require('express');
const dashboardController = require('../../controllers/dashboard.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.route('/').get(auth('getUsers'), dashboardController.getAll);
router.route('/superadmin/').get(auth('getUsers'), dashboardController.getAllSuper);
router.route('/approvepending/').get(auth('getUsers'), dashboardController.getApprove);
module.exports = router;
