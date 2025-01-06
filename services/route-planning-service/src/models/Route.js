const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  locksmithId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String
  },
  stops: [{
    jobId: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number],
      address: String
    },
    estimatedDuration: Number, // in minutes
    serviceType: String,
    expectedRevenue: Number,
    scheduledTime: Date
  }],
  totalDistance: Number, // in kilometers
  totalDuration: Number, // in minutes
  fuelExpenses: Number,
  expectedProfit: Number,
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed'],
    default: 'planned'
  }
});

module.exports = mongoose.model('Route', routeSchema); 