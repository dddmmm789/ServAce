const mongoose = require('mongoose');

const dashboardStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    totalCustomers: {
      type: Number,
      default: 0
    },
    activeLocksmiths: {
      type: Number,
      default: 0
    },
    pendingRequests: {
      type: Number,
      default: 0
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    }
  },
  regionStats: [{
    region: String,
    customerCount: Number,
    locksmithCount: Number,
    requestCount: Number
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DashboardStats', dashboardStatsSchema); 