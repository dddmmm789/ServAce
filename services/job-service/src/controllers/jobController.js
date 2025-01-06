const Job = require('../models/Job');
const logger = require('../utils/logger');
const Customer = require('../models/Customer');

const jobController = {
  // Create job from locksmith dashboard (for walk-in customers)
  async createJob(req, res) {
    try {
      const { 
        fullName, 
        phone, 
        address, 
        location,
        serviceType,
        description,
        jobType 
      } = req.body;

      // Create customer first
      const customer = await Customer.findOneAndUpdate(
        { phone }, // Find by phone if exists
        { 
          fullName,
          phone,
          addresses: address ? [{ address, location }] : []
        },
        { upsert: true, new: true }
      );

      // Create the job
      const job = await Job.create({
        customer: customer._id,
        address,
        location,
        serviceType: jobType === 'quick' ? 'standard' : serviceType,
        description,
        status: 'pending',
        jobType
      });

      res.status(201).json(job);
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  },

  // Import external jobs (e.g., from third-party platforms)
  async importExternalJobs(req, res) {
    try {
      const { jobs } = req.body;
      const locksmithId = req.user.id;

      const importedJobs = await Promise.all(jobs.map(async (jobData) => {
        const job = new Job({
          customer: {
            name: jobData.customerName,
            phone: jobData.customerPhone
          },
          locksmith: {
            id: locksmithId,
            name: req.user.name
          },
          service: jobData.service,
          location: jobData.location,
          notes: jobData.notes,
          price: jobData.price,
          status: jobData.status || 'pending',
          priority: jobData.priority || 'normal',
          externalReference: jobData.externalId // Track external source ID
        });

        return job.save();
      }));

      logger.info(`Imported ${importedJobs.length} jobs for locksmith:`, locksmithId);
      res.json({ jobs: importedJobs });
    } catch (error) {
      logger.error('Error importing jobs:', error);
      res.status(500).json({ message: 'Error importing jobs' });
    }
  },

  // Update job status
  async updateStatus(req, res) {
    try {
      const { jobId, status } = req.body;
      const locksmithId = req.user.id;

      const job = await Job.findOne({ 
        _id: jobId, 
        'locksmith.id': locksmithId 
      });

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      job.status = status;
      if (status === 'completed') {
        job.completedAt = new Date();
      }

      await job.save();
      res.json({ job });
    } catch (error) {
      logger.error('Error updating job status:', error);
      res.status(500).json({ message: 'Error updating job status' });
    }
  },

  // Get locksmith's jobs
  async getLocksmithJobs(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const locksmithId = req.user.id;
      const query = { 'locksmith.id': locksmithId };

      if (status) query.status = status;

      const jobs = await Job.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Job.countDocuments(query);

      res.json({
        jobs,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      logger.error('Error listing locksmith jobs:', error);
      res.status(500).json({ message: 'Error listing jobs' });
    }
  },

  // Get job details (only if belongs to locksmith)
  async getJob(req, res) {
    try {
      const job = await Job.findOne({
        _id: req.params.id,
        'locksmith.id': req.user.id
      });

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json({ job });
    } catch (error) {
      logger.error('Error fetching job:', error);
      res.status(500).json({ message: 'Error fetching job' });
    }
  }
};

module.exports = jobController; 