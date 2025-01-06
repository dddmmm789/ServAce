const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const { Client } = require('@googlemaps/google-maps-services-js');

const googleMapsClient = new Client({});

const customerController = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone, address, location } = req.body;

      console.log('Registration attempt:', { name, email, phone, location });

      // Check if customer already exists
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        console.log('Email already registered:', email);
        return res.status(400).json({ message: 'Email already registered' });
      }

      let locationData;
      if (location && location.type === 'Point') {
        console.log('Using provided location data');
        locationData = location;
      } else if (address) {
        console.log('Geocoding address:', address);
        try {
          const response = await googleMapsClient.geocode({
            params: {
              address: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
              key: process.env.GOOGLE_MAPS_API_KEY
            }
          });

          if (response.data.results.length === 0) {
            console.log('No geocoding results found');
            return res.status(400).json({ message: 'Invalid address' });
          }

          const location = response.data.results[0];
          const { lat, lng } = location.geometry.location;

          locationData = {
            type: 'Point',
            coordinates: [lng, lat],
            address: {
              ...address,
              formatted: location.formatted_address
            }
          };
        } catch (geocodeError) {
          console.error('Geocoding error:', geocodeError);
          return res.status(400).json({ message: 'Error validating address' });
        }
      }

      console.log('Creating customer with data:', {
        name,
        email,
        phone,
        locationData
      });

      const customer = new Customer({
        name,
        email,
        password,
        phone,
        location: locationData,
        createdBy: {
          type: 'self'
        },
        type: 'registered'
      });

      await customer.save();

      const token = jwt.sign(
        { 
          id: customer._id,
          role: 'customer'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Customer registered successfully:', customer._id);

      res.status(201).json({
        message: 'Registration successful',
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          location: customer.location.address
        }
      });

    } catch (error) {
      console.error('Registration error:', {
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ message: 'Error during registration' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const customer = await Customer.findOne({ email });
      if (!customer) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await customer.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: customer._id,
          role: 'customer'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          location: customer.location.address
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  },

  getProfile: async (req, res) => {
    try {
      const customer = await Customer.findById(req.user.id).select('-password');
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json({ customer });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      
      let updateData = {
        name,
        phone
      };

      if (address) {
        try {
          const response = await googleMapsClient.geocode({
            params: {
              address: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
              key: process.env.GOOGLE_MAPS_API_KEY
            }
          });

          if (response.data.results.length === 0) {
            return res.status(400).json({ message: 'Invalid address' });
          }

          const location = response.data.results[0];
          const { lat, lng } = location.geometry.location;

          updateData.location = {
            type: 'Point',
            coordinates: [lng, lat],
            address: {
              ...address,
              formatted: location.formatted_address
            }
          };
        } catch (geocodeError) {
          console.error('Geocoding error:', geocodeError);
          return res.status(400).json({ message: 'Error validating address' });
        }
      }

      const customer = await Customer.findByIdAndUpdate(
        req.user.id,
        { $set: updateData },
        { new: true }
      ).select('-password');

      res.json({ 
        message: 'Profile updated successfully',
        customer 
      });

    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  },

  getStats: async (req, res) => {
    try {
      // Verify service key
      const serviceKey = req.headers['service-key'];
      if (serviceKey !== process.env.SERVICE_KEY) {
        return res.status(403).json({ message: 'Invalid service key' });
      }

      const totalCustomers = await Customer.countDocuments();
      const activeCustomers = await Customer.countDocuments({ status: 'active' });
      const verifiedCustomers = await Customer.countDocuments({ 
        verificationStatus: 'verified' 
      });

      res.json({
        total: totalCustomers,
        active: activeCustomers,
        verified: verifiedCustomers
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ message: 'Error fetching stats' });
    }
  }
};

module.exports = customerController; 