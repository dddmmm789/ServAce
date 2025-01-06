const Route = require('../models/Route');
const axios = require('axios');
const logger = require('../utils/logger');

const routeController = {
  async planRoute(req, res) {
    try {
      const { locksmithId, jobs, startLocation, date } = req.body;

      // Get distance matrix from Google Maps API
      const distanceMatrix = await getDistanceMatrix(startLocation, jobs.map(j => j.location));

      // Optimize route using nearest neighbor algorithm
      const optimizedStops = optimizeRoute(jobs, distanceMatrix);

      // Calculate expenses and revenue
      const fuelCostPerKm = 0.15; // Configure based on locale
      const totalDistance = calculateTotalDistance(optimizedStops, distanceMatrix);
      const fuelExpenses = totalDistance * fuelCostPerKm;
      const expectedRevenue = optimizedStops.reduce((sum, stop) => sum + stop.expectedRevenue, 0);

      const route = new Route({
        locksmithId,
        date,
        startLocation,
        stops: optimizedStops,
        totalDistance,
        totalDuration: calculateTotalDuration(optimizedStops),
        fuelExpenses,
        expectedProfit: expectedRevenue - fuelExpenses
      });

      await route.save();
      res.status(201).json(route);
    } catch (error) {
      logger.error('Route planning error:', error);
      res.status(500).json({ message: 'Error planning route' });
    }
  },

  async startRoute(req, res) {
    try {
      const { routeId } = req.params;
      const route = await Route.findByIdAndUpdate(
        routeId,
        { status: 'in_progress' },
        { new: true }
      );
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: 'Error starting route' });
    }
  }
};

module.exports = routeController; 