const express = require('express');
const router = express.Router();
const {
  sendNotification,
  getNotificationsByUserId
} = require('../controllers/notificationController');

router.post('/send', sendNotification);
router.get('/user/:id', getNotificationsByUserId);

module.exports = router;


