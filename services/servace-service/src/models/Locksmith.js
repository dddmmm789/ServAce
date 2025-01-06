const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // ... rest of schema
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema); 