const Admin = require('../models/Admin');
const Locksmith = require('../models/Locksmith');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const adminController = {
  async login(req, res) {
    try {
      logger.info('Admin login attempt:', { 
        body: req.body,
        headers: req.headers 
      });

      const { email, password } = req.body;

      if (!email || !password) {
        logger.warn('Missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const admin = await Admin.findOne({ email });
      logger.info('Admin search result:', { 
        found: !!admin,
        email: admin?.email,
        _id: admin?._id,
        hasPassword: !!admin?.password
      });

      if (!admin) {
        logger.warn('Admin not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      logger.info('Comparing passwords:', {
        providedPassword: password,
        hashedPassword: admin.password
      });

      const isMatch = await admin.comparePassword(password);
      logger.info('Password match result:', { isMatch });

      if (!isMatch) {
        logger.warn('Invalid password for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      logger.info('Login successful:', { email, token });
      res.json({ token });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ 
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  async getDashboard(req, res) {
    try {
      const stats = {
        totalLocksmiths: await Locksmith.countDocuments(),
        pendingVerifications: await Locksmith.countDocuments({ verificationStatus: 'pending' })
      };
      res.json(stats);
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      res.status(500).json({ message: 'Error getting dashboard data' });
    }
  },

  async getLocksmiths(req, res) {
    try {
      const locksmiths = await Locksmith.find()
        .select('-password')
        .sort({ createdAt: -1 });
      res.json(locksmiths);
    } catch (error) {
      logger.error('Error getting locksmiths:', error);
      res.status(500).json({ message: 'Error getting locksmiths' });
    }
  },

  async getLocksmithById(req, res) {
    try {
      const locksmith = await Locksmith.findById(req.params.id)
        .select('-password');
      
      if (!locksmith) {
        return res.status(404).json({ message: 'Locksmith not found' });
      }
      
      res.json(locksmith);
    } catch (error) {
      logger.error('Error getting locksmith details:', error);
      res.status(500).json({ message: 'Error getting locksmith details' });
    }
  },

  async updateLocksmithStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'verified', 'rejected', 'suspended'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const updates = {
        verificationStatus: status,
        verifiedAt: status === 'verified' ? new Date() : null
      };

      if (status === 'suspended') {
        updates.verifiedAt = null;
        updates.documents = updates.documents?.map(doc => ({
          ...doc,
          verified: false
        }));
      }

      const locksmith = await Locksmith.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      ).select('-password');

      if (!locksmith) {
        return res.status(404).json({ message: 'Locksmith not found' });
      }

      logger.info(`Updated locksmith status: ${id} to ${status}`);
      res.json(locksmith);
    } catch (error) {
      logger.error('Error updating locksmith status:', error);
      res.status(500).json({ message: 'Error updating locksmith status' });
    }
  },

  async enterLocksmithMode(req, res) {
    try {
      const { locksmithId } = req.params;
      const locksmith = await Locksmith.findById(locksmithId);
      
      if (!locksmith) {
        return res.status(404).json({ message: 'Locksmith not found' });
      }

      // Generate a special admin-as-locksmith token
      const token = jwt.sign(
        { 
          id: locksmith._id, 
          role: 'locksmith',
          adminMode: true,
          originalAdminId: req.user.id
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ 
        token,
        locksmith: {
          id: locksmith._id,
          name: locksmith.name,
          email: locksmith.email,
          businessInfo: locksmith.businessInfo
        }
      });
    } catch (error) {
      logger.error('Error entering locksmith mode:', error);
      res.status(500).json({ message: 'Error entering locksmith mode' });
    }
  }
};

module.exports = adminController; 