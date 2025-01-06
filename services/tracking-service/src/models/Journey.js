const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    coordinates: {
        type: [Number],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const journeySchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        unique: true
    },
    locksmithId: {
        type: String,
        required: true
    },
    startLocation: locationSchema,
    destination: locationSchema,
    currentLocation: locationSchema,
    status: {
        type: String,
        enum: ['started', 'in_progress', 'completed', 'cancelled'],
        default: 'started'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Journey', journeySchema);