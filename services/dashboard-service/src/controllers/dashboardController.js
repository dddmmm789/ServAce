const DashboardStats = require('../models/DashboardStats');
const axios = require('axios');
const logger = require('../utils/logger');

const dashboardController = {
  getStats: async (req, res) => {
    try {
      const stats = await DashboardStats.findOne()
        .sort({ date: -1 })
        .limit(1);

      if (!stats) {
        return res.status(404).json({ message: 'No stats available' });
      }

      res.json({ stats });
    } catch (error) {
      logger.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
  },

  updateStats: async (req, res) => {
    try {
      logger.info('Fetching stats from services...');
      let customersData, locksmithsData, requestsData;

      try {
        const [customers, locksmiths, requests] = await Promise.all([
          axios.get(`${process.env.CUSTOMER_SERVICE_URL}/api/stats`, {
            headers: { 'Service-Key': process.env.SERVICE_KEY }
          }),
          axios.get(`${process.env.ADMIN_SERVICE_URL}/api/stats`, {
            headers: { 'Service-Key': process.env.SERVICE_KEY }
          }),
          axios.get(`${process.env.LOCKSMITH_SERVICE_URL}/api/stats`, {
            headers: { 'Service-Key': process.env.SERVICE_KEY }
          })
        ]);
        customersData = customers.data;
        locksmithsData = locksmiths.data;
        requestsData = requests.data;
      } catch (fetchError) {
        logger.error('Error fetching service stats:', {
          error: fetchError.message,
          response: fetchError.response?.data,
          config: {
            customerUrl: process.env.CUSTOMER_SERVICE_URL,
            adminUrl: process.env.ADMIN_SERVICE_URL,
            locksmithUrl: process.env.LOCKSMITH_SERVICE_URL
          }
        });
        throw new Error('Failed to fetch service stats');
      }

      logger.info('Stats received:', {
        customers: customersData,
        locksmiths: locksmithsData,
        requests: requestsData
      });

      const stats = new DashboardStats({
        metrics: {
          totalCustomers: customersData?.total || 0,
          activeLocksmiths: locksmithsData?.active || 0,
          pendingRequests: requestsData?.pending || 0,
          completedJobs: requestsData?.completed || 0
        }
      });

      await stats.save();
      logger.info('Stats saved successfully:', stats);
      res.json({ message: 'Stats updated successfully', stats });
    } catch (error) {
      logger.error('Error updating stats:', {
        error: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      res.status(500).json({ 
        message: 'Error updating dashboard stats',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = dashboardController; 