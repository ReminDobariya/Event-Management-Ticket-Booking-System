const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingsByUserId,
  updateBookingStatus
} = require('../controllers/bookingController');

router.post('/create', createBooking);
router.get('/:userId', getBookingsByUserId);
router.put('/:id/status', updateBookingStatus);

module.exports = router;


