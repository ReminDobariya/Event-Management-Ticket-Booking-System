const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Ensure availableSeats doesn't exceed totalSeats
eventSchema.pre('save', function(next) {
  if (this.availableSeats > this.totalSeats) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);


