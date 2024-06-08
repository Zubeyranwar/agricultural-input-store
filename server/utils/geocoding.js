// const axios = require("axios");

// const API_KEY = "c6cf872d5125418083c861098d36db50";
// const GEOAPIFY_GEOCODE_URL = "https://api.geoapify.com/v1/geocode/search";
// const GEOAPIFY_REVERSE_GEOCODE_URL =
//   "https://api.geoapify.com/v1/geocode/reverse";

// const geocodeAddress = async (address) => {
//   try {
//     console.log(`Geocoding address: ${address}`);
//     const response = await axios.get(GEOAPIFY_GEOCODE_URL, {
//       params: {
//         text: address,
//         apiKey: API_KEY,
//       },
//     });

//     if (response.data.features.length > 0) {
//       const { lat, lon } = response.data.features[0].properties;
//       console.log(
//         `Geocoded coordinates for ${address}: lat=${lat}, lon=${lon}`
//       );
//       return { lat, lon };
//     } else {
//       throw new Error("No results found");
//     }
//   } catch (error) {
//     console.error("Error geocoding address:", error);
//     throw error;
//   }
// };

// const reverseGeocodeCoordinates = async (lat, lon) => {
//   try {
//     console.log(`Reverse geocoding coordinates: lat=${lat}, lon=${lon}`);
//     const response = await axios.get(GEOAPIFY_REVERSE_GEOCODE_URL, {
//       params: {
//         lat,
//         lon,
//         apiKey: API_KEY,
//       },
//     });

//     if (response.data.features.length > 0) {
//       const address = response.data.features[0].properties.formatted;
//       console.log(
//         `Reverse geocoded address for lat=${lat}, lon=${lon}: ${address}`
//       );
//       return address;
//     } else {
//       throw new Error("No results found");
//     }
//   } catch (error) {
//     console.error(
//       `Error reverse geocoding coordinates lat=${lat}, lon=${lon}:`,
//       error
//     );
//     throw error;
//   }
// };

// module.exports = {
//   geocodeAddress,
//   reverseGeocodeCoordinates,
// };
