const Notification = require('../models/Notification');

// Generate unique notification ID
const generateNotificationId = () => {
  return `NOTIF${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

// Send notification
exports.sendNotification = async (req, res) => {
  try {
    const { userId, bookingId, paymentId, message, type } = req.body;

    // Validation
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: message'
      });
    }

    // Determine notification type if not provided
    let notificationType = type || 'general';
    if (paymentId && !type) {
      notificationType = 'payment_confirmation';
    } else if (bookingId && !type) {
      notificationType = 'booking_confirmation';
    }

    // Create notification
    const notification = new Notification({
      notificationId: generateNotificationId(),
      userId: userId || null,
      bookingId: bookingId || null,
      paymentId: paymentId || null,
      type: notificationType,
      message,
      status: 'sent',
      sentAt: new Date()
    });

    await notification.save();

    // Simulate sending notification (email/SMS)
    console.log(`📧 Notification sent: ${message}`);

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message
    });
  }
};

// Get notifications by user ID
exports.getNotificationsByUserId = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};


