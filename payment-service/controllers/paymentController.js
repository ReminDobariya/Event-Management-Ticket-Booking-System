const Payment = require('../models/Payment');
const axios = require('axios');

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4004';

// Generate unique payment ID
const generatePaymentId = () => {
  return `PAY${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

// Simulate payment processing (dummy logic)
const simulatePayment = () => {
  // Simulate 90% success rate for demo purposes
  return Math.random() > 0.1;
};

// Initiate payment
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, userId, amount } = req.body;

    // Validation
    if (!bookingId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingId, amount'
      });
    }

    if (amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be non-negative'
      });
    }

    // Simulate payment processing
    const paymentSuccess = simulatePayment();
    const paymentStatus = paymentSuccess ? 'success' : 'failed';

    // Create payment record
    const payment = new Payment({
      paymentId: generatePaymentId(),
      bookingId,
      amount,
      status: paymentStatus,
      paymentMethod: 'dummy_card',
      transactionDate: new Date()
    });

    await payment.save();

    // If payment successful, call Notification Service
    if (paymentSuccess) {
      try {
        await axios.post(`${NOTIFICATION_SERVICE_URL}/notifications/send`, {
          userId: userId || null,
          bookingId: bookingId,
          paymentId: payment.paymentId,
          amount: amount,
          status: 'success',
          message: `Payment of ₹${amount} confirmed for booking ${bookingId}`
        });
      } catch (error) {
        console.error('Error calling Notification Service:', error.message);
        // Don't fail the payment if notification fails
      }
    }

    res.status(201).json({
      success: true,
      message: `Payment ${paymentStatus}`,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};

// Get payment status by payment ID
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.id });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status',
      error: error.message
    });
  }
};

