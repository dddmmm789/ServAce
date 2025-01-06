const Job = require('../models/Job');

// Create a new job
const createJob = async (req, res) => {
  try {
    console.log('Received job creation request:', req.body);
    
    const { customerName, phoneNumber, location } = req.body;

    // Validate required fields
    if (!customerName || !phoneNumber || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create new job
    const job = new Job({
      customerName,
      phoneNumber,
      customerLocation: {
        address: location.address,
        coordinates: location.coordinates || { lat: 0, lng: 0 }
      },
      status: 'pending'
    });

    console.log('Created job instance:', job);

    // Save to database
    const savedJob = await job.save();
    console.log('Job saved successfully:', savedJob);

    // Send response
    res.status(201).json({
      success: true,
      job: savedJob
    });
  } catch (error) {
    console.error('Error in createJob:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating job'
    });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a specific job
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update job status
const updateStatus = async (req, res) => {
  try {
    const { jobId, status } = req.body;
    const job = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true }
    );
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get locksmith jobs
const getLocksmithJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Import external jobs
const importExternalJobs = async (req, res) => {
  try {
    const { jobs } = req.body;
    const savedJobs = await Job.insertMany(jobs);
    res.json({ success: true, jobs: savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateStatus,
  getLocksmithJobs,
  importExternalJobs
}; 