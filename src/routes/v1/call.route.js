const express = require('express');
const { callController } = require('../../controllers');
require('../../middlewares/auth');
require('../../middlewares/validate');

// const upload = require('../../middlewares/upload-image');

const router = express.Router();
router.route('/').get(callController.getCalls).post(callController.createCall);

router.route('/count-calls-by-day').get(callController.countCallsByDay);
router.route('/count-calls-by-month').get(callController.countCallsByMonth);

//

router.route('/:callId').get(callController.getCall).patch(callController.updateCall).delete(callController.deleteCall);

// router.route('/search/:searchId').get(callController.getCompanyBySearch);
module.exports = router;
