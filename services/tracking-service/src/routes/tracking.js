const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Journey = require('../models/Journey');

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'tracking-service',
        timestamp: new Date().toISOString()
    });
});

// Create a new journey
router.post('/journey', auth, async (req, res) => {
    try {
        const { jobId, startLocation, destination } = req.body;
        
        // Validate required fields
        if (!jobId || !startLocation || !destination) {
            return res.status(400).json({ 
                message: 'Missing required fields: jobId, startLocation, and destination are required' 
            });
        }

        const journey = new Journey({
            jobId,
            locksmithId: req.user.id,
            startLocation,
            destination,
            currentLocation: startLocation,
            status: 'started'
        });

        await journey.save();
        res.status(201).json({
            success: true,
            journey
        });
    } catch (error) {
        console.error('Create journey error:', error);
        res.status(500).json({ 
            message: 'Error creating journey',
            error: error.message 
        });
    }
});

// Update locksmith location
router.post('/location', auth, async (req, res) => {
    try {
        const { jobId, latitude, longitude } = req.body;

        // Validate required fields
        if (!jobId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ 
                message: 'Missing required fields: jobId, latitude, and longitude are required' 
            });
        }

        const journey = await Journey.findOneAndUpdate(
            { 
                jobId, 
                locksmithId: req.user.id,
                status: { $ne: 'completed' } // Don't update completed journeys
            },
            {
                'currentLocation.coordinates': [longitude, latitude],
                'currentLocation.updatedAt': new Date()
            },
            { new: true }
        );

        if (!journey) {
            return res.status(404).json({ 
                message: 'Active journey not found for this job ID' 
            });
        }

        res.json({
            success: true,
            journey
        });
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ 
            message: 'Error updating location',
            error: error.message 
        });
    }
});

// Get journey status
router.get('/journey/:jobId', auth, async (req, res) => {
    try {
        const journey = await Journey.findOne({ 
            jobId: req.params.jobId 
        });

        if (!journey) {
            return res.status(404).json({ 
                message: 'Journey not found' 
            });
        }

        res.json({
            success: true,
            journey
        });
    } catch (error) {
        console.error('Get journey error:', error);
        res.status(500).json({ 
            message: 'Error retrieving journey',
            error: error.message 
        });
    }
});

// Complete journey
router.post('/journey/:jobId/complete', auth, async (req, res) => {
    try {
        const journey = await Journey.findOneAndUpdate(
            { 
                jobId: req.params.jobId,
                locksmithId: req.user.id,
                status: { $ne: 'completed' }
            },
            {
                status: 'completed',
                completedAt: new Date()
            },
            { new: true }
        );

        if (!journey) {
            return res.status(404).json({ 
                message: 'Active journey not found for this job ID' 
            });
        }

        res.json({
            success: true,
            journey
        });
    } catch (error) {
        console.error('Complete journey error:', error);
        res.status(500).json({ 
            message: 'Error completing journey',
            error: error.message 
        });
    }
});

module.exports = router;