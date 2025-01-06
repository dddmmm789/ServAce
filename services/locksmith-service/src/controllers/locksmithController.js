const Locksmith = require('../models/Locksmith');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const locksmithController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const locksmith = await Locksmith.findOne({ email });

      if (!locksmith) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await locksmith.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: locksmith._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  },

  async createQuickJob(req, res) {
    try {
      const { searchType, searchValue, type, urgency } = req.body;
      const locksmithId = req.locksmith.id;

      const job = new Job({
        locksmithId,
        type,
        urgency,
        status: 'active',
        [searchType]: searchValue,
        createdAt: new Date()
      });

      await job.save();
      logger.info(`Quick job created by locksmith ${locksmithId}`);
      res.status(201).json({ jobId: job._id });
    } catch (error) {
      logger.error('Error creating quick job:', error);
      res.status(500).json({ message: 'Error creating job' });
    }
  },

  async getJobDetails(req, res) {
    try {
      const { jobId } = req.params;
      const job = await Job.findOne({ 
        _id: jobId,
        locksmithId: req.locksmith.id 
      });

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json(job);
    } catch (error) {
      logger.error('Error getting job details:', error);
      res.status(500).json({ message: 'Error getting job details' });
    }
  },

  async completeJob(req, res) {
    try {
      const { jobId } = req.params;
      const { totalAmount, platformFee, expenses, netIncome } = req.body;

      const job = await Job.findOneAndUpdate(
        { _id: jobId, locksmithId: req.locksmith.id },
        {
          status: 'completed',
          completedAt: new Date(),
          financials: { totalAmount, platformFee, expenses, netIncome }
        },
        { new: true }
      );

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json({ message: 'Job completed successfully' });
    } catch (error) {
      logger.error('Error completing job:', error);
      res.status(500).json({ message: 'Error completing job' });
    }
  },

  async getDailySummary(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const jobs = await Job.find({
        locksmithId: req.locksmith.id,
        status: 'completed',
        completedAt: { $gte: today }
      }).sort({ completedAt: -1 });

      const totals = jobs.reduce((acc, job) => ({
        revenue: acc.revenue + (job.financials?.totalAmount || 0),
        platformFees: acc.platformFees + (job.financials?.platformFee || 0),
        expenses: acc.expenses + (job.financials?.expenses || 0),
        netIncome: acc.netIncome + (job.financials?.netIncome || 0)
      }), { revenue: 0, platformFees: 0, expenses: 0, netIncome: 0 });

      res.json({ jobs, totals });
    } catch (error) {
      logger.error('Error getting daily summary:', error);
      res.status(500).json({ message: 'Error getting daily summary' });
    }
  },

  async createJob(req, res) {
    try {
      console.log('Received job creation request:', req.body);

      const { fullName, phoneNumber, address, serviceType, description } = req.body;
      
      // Validate required fields
      if (!fullName) {
        console.log('Validation failed: fullName is required');
        return res.status(400).json({ error: 'Full name is required' });
      }
      
      // Require either phone number or address
      if (!phoneNumber && !address) {
        console.log('Validation failed: either phone or address is required');
        return res.status(400).json({ error: 'Either phone number or address is required' });
      }

      // Create the job document
      const jobData = {
        customerName: fullName,
        phoneNumber: phoneNumber || null,
        address: address || null,
        serviceType: serviceType || 'standard',
        description: description || '',
        status: 'pending'
      };

      console.log('Attempting to create job with data:', jobData);

      const job = await Job.create(jobData);

      console.log('Job created successfully:', job);

      // Return the created job
      return res.status(201).json({
        success: true,
        job: job.toObject()
      });
    } catch (error) {
      console.error('Error creating job:', error);
      // Send a properly formatted error response
      return res.status(500).json({
        success: false,
        error: 'Error occurred while creating job',
        details: error.message
      });
    }
  }
};

module.exports = locksmithController; 