const Event = require('../models/Event');

// Create a new event
exports.addEvent = async (req, res) => {
  try {
    const { eventId, name, category, date, venue, totalSeats, availableSeats, ticketPrice } = req.body;

    // Validation
    if (!eventId || !name || !category || !date || !venue || !totalSeats || ticketPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // If availableSeats not provided, set it to totalSeats
    const seatsAvailable = availableSeats !== undefined ? availableSeats : totalSeats;

    const event = new Event({
      eventId,
      name,
      category,
      date,
      venue,
      totalSeats,
      availableSeats: seatsAvailable,
      ticketPrice
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Event with this eventId already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { name, category, date, venue, totalSeats, availableSeats, ticketPrice } = req.body;
    
    const event = await Event.findOne({ eventId: req.params.id });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Update fields if provided
    if (name) event.name = name;
    if (category) event.category = category;
    if (date) event.date = date;
    if (venue) event.venue = venue;
    if (totalSeats !== undefined) {
      event.totalSeats = totalSeats;
      // Adjust availableSeats if needed
      if (event.availableSeats > totalSeats) {
        event.availableSeats = totalSeats;
      }
    }
    if (availableSeats !== undefined) {
      event.availableSeats = Math.min(availableSeats, event.totalSeats);
    }
    if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ eventId: req.params.id });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Helper function to update available seats (called by booking service)
exports.updateAvailableSeats = async (eventId, seatsToReserve) => {
  try {
    const event = await Event.findOne({ eventId });
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.availableSeats < seatsToReserve) {
      throw new Error('Insufficient seats available');
    }
    event.availableSeats -= seatsToReserve;
    await event.save();
    return event;
  } catch (error) {
    throw error;
  }
};


