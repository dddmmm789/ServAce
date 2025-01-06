const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

async function geocodeAddress(address) {
  try {
    if (address && address.coordinates && address.coordinates.length === 2) {
      return {
        type: 'Point',
        coordinates: address.coordinates,
        address: address.address || {}
      };
    }

    if (typeof address === 'string') {
      const response = await client.geocode({
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          type: 'Point',
          coordinates: [location.lng, location.lat],
          address: {
            formatted: response.data.results[0].formatted_address
          }
        };
      }
    }

    if (address && address.type === 'Point') {
      return address;
    }

    throw new Error('Invalid address format');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

module.exports = geocodeAddress; 