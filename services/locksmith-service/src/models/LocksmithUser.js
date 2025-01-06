const mongoose = require('mongoose');

const LocksmithSchema = new mongoose.Schema({
  // ... existing fields ...
  
  activeJobs: [{
    jobId: mongoose.Schema.Types.ObjectId,
    journeyId: mongoose.Schema.Types.ObjectId,
    status: String
  }],
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number],
    updatedAt: Date
  }
});

module.exports = mongoose.model('LocksmithUser', LocksmithSchema); 