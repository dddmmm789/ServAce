const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Jobs router is working' });
});

// Get all jobs
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching jobs for user:', req.user);
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/create', auth, async (req, res) => {
  try {
    console.log('Creating job with data:', req.body);
    
    const job = new Job({
      customerName: req.body.customerName,
      phoneNumber: req.body.phoneNumber,
      customerLocation: req.body.customerLocation,
      locksmithLocation: {
        address: "Current Location",
        coordinates: { lat: 0, lng: 0 }
      },
      status: 'pending'
    });

    const savedJob = await job.save();
    console.log('Job created successfully:', savedJob);

    // Send JSON response with proper headers
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({
      success: true,
      job: savedJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get active job
router.get('/active', auth, async (req, res) => {
  try {
    console.log('Fetching active job, auth user:', req.user);
    
    const activeJob = await Job.findOne({
      status: { $in: ['pending', 'in-progress'] }
    }).sort({ createdAt: -1 });

    console.log('Found active job:', activeJob);

    // Send JSON response with proper headers
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      job: activeJob
    });
  } catch (error) {
    console.error('Error fetching active job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Activate job
router.post('/:jobId/activate', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { status: 'in-progress' },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Complete job
router.post('/:jobId/complete', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { status: 'completed' },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 