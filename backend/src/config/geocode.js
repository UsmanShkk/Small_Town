const axios = require('axios');

const getCoordinatesFromAddress = async (address) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'meal-app-vendor-registration' }, // Required by Nominatim
    });

    if (!response.data.length) return null;

    const { lat, lon } = response.data[0];
    return {
      type: 'Point',
      coordinates: [parseFloat(lon), parseFloat(lat)],
    };
  } catch (err) {
    console.error('Geocoding error:', err.message);
    return null;
  }
};

module.exports = getCoordinatesFromAddress;
