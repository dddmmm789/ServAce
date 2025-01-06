const AdminLocksmith = require('../models/AdminLocksmith');
const axios = require('axios');
const logger = require('../utils/logger');

const LOCKSMITH_SERVICE_URL = process.env.LOCKSMITH_SERVICE_URL || 'http://localhost:3002';
const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'http://localhost:3004';

const locksmithController = {
  async getAllLocksmiths(req, res) {
    try {
      const { status, page = 1, limit = 10, search } = req.query;
      logger.info('Fetching locksmiths with filters:', { status, page, limit, search });

      let query = {};
      if (status) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { 'location.city': new RegExp(search, 'i') }
        ];
      }

      const skip = (page - 1) * limit;
      
      const [locksmiths, total] = await Promise.all([
        AdminLocksmith.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ createdAt: -1 }),
        AdminLocksmith.countDocuments(query)
      ]);

      logger.info(`Found ${locksmiths.length} locksmiths`);
      
      res.json({
        locksmiths,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      logger.error('Error fetching locksmiths:', error);
      res.status(500).json({ 
        message: 'Error fetching locksmiths',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getLocksmithById(req, res) {
    try {
      const { id } = req.params;
      logger.info('Fetching locksmith details:', id);

      const locksmith = await AdminLocksmith.findById(id);
      
      if (!locksmith) {
        return res.status(404).json({ message: 'Locksmith not found' });
      }

      // Fetch reviews from review service
      try {
        const reviewsResponse = await axios.get(
          `${REVIEW_SERVICE_URL}/api/reviews/locksmith/${id}`,
          {
            headers: {
              'Authorization': req.headers.authorization,
              'X-Service-Key': process.env.SERVICE_KEY
            }
          }
        );
        locksmith.reviews = reviewsResponse.data;
      } catch (reviewError) {
        logger.error('Error fetching reviews:', reviewError);
        locksmith.reviews = [];
      }
      
      res.json(locksmith);
    } catch (error) {
      logger.error('Error fetching locksmith:', error);
      res.status(500).json({ message: 'Error fetching locksmith details' });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      logger.info('Updating locksmith status:', { id, status, reason });

      const locksmith = await AdminLocksmith.findByIdAndUpdate(
        id,
        { 
          status,
          statusUpdateReason: reason,
          statusUpdatedAt: new Date()
        },
        { new: true }
      );

      if (!locksmith) {
        return res.status(404).json({ message: 'Locksmith not found' });
      }

      // Sync status to locksmith service
      try {
        await axios.put(
          `${LOCKSMITH_SERVICE_URL}/api/locksmiths/${id}/status`,
          { status, reason },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Service-Key': process.env.SERVICE_KEY
            }
          }
        );
        logger.info('Status synced with locksmith service');
      } catch (syncError) {
        logger.error('Status sync error:', syncError);
      }

      res.json({ 
        message: 'Status updated successfully', 
        locksmith 
      });
    } catch (error) {
      logger.error('Status update error:', error);
      res.status(500).json({ message: 'Error updating status' });
    }
  },

  async syncLocksmith(req, res) {
    try {
      const { locksmith } = req.body;
      logger.info('Syncing locksmith:', locksmith._id);

      if (!locksmith) {
        return res.status(400).json({ message: 'No locksmith data provided' });
      }

      const result = await AdminLocksmith.findOneAndUpdate(
        { _id: locksmith._id },
        locksmith,
        { new: true, upsert: true }
      );

      logger.info('Locksmith synced successfully');
      res.json({ 
        message: 'Locksmith synced successfully', 
        locksmith: result 
      });
    } catch (error) {
      logger.error('Sync error:', error);
      res.status(500).json({ message: 'Error syncing locksmith' });
    }
  }
};

module.exports = locksmithController; 