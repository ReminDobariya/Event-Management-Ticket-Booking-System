const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  getPaymentStatus
} = require('../controllers/paymentController');

router.post('/initiate', initiatePayment);
router.get('/:id/status', getPaymentStatus);

module.exports = router;


