const axios = require('axios');

async function getCoordinatesFromAddress(address) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    }
    throw new Error('No results found for address');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

module.exports = {
  getCoordinatesFromAddress
}; 