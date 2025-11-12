const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userId: {
    type: String,
    trim: true
  },
  bookingId: {
    type: String,
    trim: true
  },
  paymentId: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['payment_confirmation', 'booking_confirmation', 'booking_cancellation', 'general'],
    default: 'general'
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'pending', 'failed'],
    default: 'sent'
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);


