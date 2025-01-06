const express = require('express');
const Job = require('../models/Job');
const detectDeviceType = require('../utils/detectDeviceType');

const router = express.Router();

router.post('/:jobId/track-view', async (req, res) => {
  try {
    const { jobId } = req.params;
    const userAgent = req.headers['user-agent'];
    
    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        $push: {
          customerViews: {
            timestamp: new Date(),
            userAgent,
            deviceType: detectDeviceType(userAgent)
          }
        }
      },
      { new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:jobId/update-address', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { floor, apartment, additionalInfo } = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        'addressDetails': {
          floor,
          apartment,
          additionalInfo,
          lastUpdated: new Date(),
          isConfirmed: true
        }
      },
      { new: true }
    );

    res.json({ success: true, job });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Received job data:', req.body); // Debug log

    const jobData = {
      customerName: req.body.customerName,
      phoneNumber: req.body.phoneNumber,
      customerLocation: req.body.customerLocation,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating job with:', jobData); // Debug log

    const job = new Job(jobData);
    await job.save();

    console.log('Job created:', job); // Debug log
    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/activate-pending', async (req, res) => {
  try {
    const result = await Job.updateMany(
      { status: 'pending' },
      { $set: { status: 'active' } }
    );
    
    res.json({ 
      success: true, 
      message: `Updated ${result.modifiedCount} jobs from pending to active`
    });
  } catch (error) {
    console.error('Error updating job statuses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 