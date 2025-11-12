const Booking = require('../models/Booking');
const axios = require('axios');

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://localhost:4001';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:4003';

// Generate unique booking ID
const generateBookingId = () => {
  return `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, eventId, numberOfTickets } = req.body;

    // Validation
    if (!userId || !eventId || !numberOfTickets) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, eventId, numberOfTickets'
      });
    }

    if (numberOfTickets < 1) {
      return res.status(400).json({
        success: false,
        message: 'Number of tickets must be at least 1'
      });
    }

    // Call Event Service to verify availability and get event details
    let eventData;
    try {
      const eventResponse = await axios.get(`${EVENT_SERVICE_URL}/events/${eventId}`);
      eventData = eventResponse.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Error connecting to Event Service',
        error: error.message
      });
    }

    // Check seat availability
    if (eventData.availableSeats < numberOfTickets) {
      return res.status(400).json({
        success: false,
        message: `Insufficient seats available. Only ${eventData.availableSeats} seats remaining.`
      });
    }

    // Calculate total amount
    const totalAmount = eventData.ticketPrice * numberOfTickets;

    // Create booking
    const booking = new Booking({
      bookingId: generateBookingId(),
      userId,
      eventId,
      numberOfTickets,
      totalAmount,
      status: 'pending_payment'
    });

    await booking.save();

    // Update available seats in Event Service
    try {
      await axios.put(`${EVENT_SERVICE_URL}/events/${eventId}`, {
        availableSeats: eventData.availableSeats - numberOfTickets
      });
    } catch (error) {
      // If seat update fails, delete the booking
      await Booking.findByIdAndDelete(booking._id);
      return res.status(500).json({
        success: false,
        message: 'Error updating event seats',
        error: error.message
      });
    }

    // Call Payment Service to initiate payment
    try {
      const paymentResponse = await axios.post(`${PAYMENT_SERVICE_URL}/payments/initiate`, {
        bookingId: booking.bookingId,
        userId: userId,
        amount: totalAmount
      });

      if (paymentResponse.data.success && paymentResponse.data.data.status === 'success') {
        // Update booking status to confirmed
        booking.status = 'confirmed';
        booking.paymentId = paymentResponse.data.data.paymentId;
        await booking.save();

        return res.status(201).json({
          success: true,
          message: 'Booking created and payment confirmed',
          data: booking
        });
      } else {
        // Payment failed, keep booking as pending_payment
        return res.status(201).json({
          success: true,
          message: 'Booking created but payment pending',
          data: booking
        });
      }
    } catch (error) {
      // Payment service error, but booking is created
      return res.status(201).json({
        success: true,
        message: 'Booking created but payment service unavailable',
        data: booking
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get bookings by userId
exports.getBookingsByUserId = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending_payment', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending_payment, confirmed, cancelled'
      });
    }

    const booking = await Booking.findOne({ bookingId: req.params.id });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // If cancelling, release seats back to Event Service
    if (status === 'cancelled' && booking.status !== 'cancelled') {
      try {
        const eventResponse = await axios.get(`${EVENT_SERVICE_URL}/events/${booking.eventId}`);
        const eventData = eventResponse.data.data;
        
        await axios.put(`${EVENT_SERVICE_URL}/events/${booking.eventId}`, {
          availableSeats: eventData.availableSeats + booking.numberOfTickets
        });
      } catch (error) {
        console.error('Error releasing seats:', error.message);
      }
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

