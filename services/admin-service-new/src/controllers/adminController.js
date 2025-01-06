const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const adminController = {
  // Authentication
  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;
      
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingAdmin) {
        return res.status(400).json({ 
          message: 'User with this email or username already exists' 
        });
      }

      const admin = new Admin({
        username,
        email,
        password,
        role
      });

      await admin.save();

      res.status(201).json({
        message: 'Admin user created successfully',
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      logger.error('Register error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      logger.info('Login attempt received:', {
        email: req.body.email
      });

      const { email, password } = req.body;
      
      const admin = await Admin.findOne({ email });
      
      if (!admin) {
        logger.warn('Admin not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await admin.comparePassword(password);
      
      if (!isMatch) {
        logger.warn('Invalid password for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      const token = jwt.sign(
        { 
          id: admin._id, 
          role: admin.role,
          permissions: admin.permissions 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      logger.info('Login successful:', email);
      res.json({
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          username: admin.username,
          role: admin.role,
          permissions: admin.permissions
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Profile Management
  async getProfile(req, res) {
    try {
      const admin = await Admin.findById(req.user.id).select('-password');
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.json(admin);
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const updates = req.body;
      delete updates.password; // Prevent password update through this endpoint

      const admin = await Admin.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true }
      ).select('-password');

      res.json({
        message: 'Profile updated successfully',
        admin
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // System Management
  async getSystemStatus(req, res) {
    try {
      const systemStatus = {
        database: {
          status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          name: 'MongoDB',
          details: {
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            name: mongoose.connection.name
          }
        },
        services: {
          locksmith: {
            status: 'operational',
            lastChecked: new Date()
          },
          review: {
            status: 'operational',
            lastChecked: new Date()
          }
        },
        timestamp: new Date(),
        uptime: process.uptime()
      };

      res.json(systemStatus);
    } catch (error) {
      logger.error('System status error:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = adminController; 