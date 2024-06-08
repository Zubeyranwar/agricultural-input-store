// const cron = require("node-cron");
// const axios = require("axios");
// const Order = require("./models/Order");
// const {
//   geocodeAddress,
//   reverseGeocodeCoordinates,
// } = require("./utils/geocoding");

// const API_URL = "http://localhost:3001/api"; // Replace with your actual API URL
// const AUTH_TOKEN =
//   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDhkYzU1MjNiMTU0MDJiNDQxNzJiNyIsImlhdCI6MTcxNjg2ODI4MywiZXhwIjoxNzE3NDczMDgzfQ.P5dNa7kZscfihx1sGQaL8Oo8R7WLU4UN9S36cvOFyRY"; // Ensure your token is set in your environment variables

// const calculateNextLocation = (start, end, distance) => {
//   const toRadians = (degree) => degree * (Math.PI / 180);
//   const toDegrees = (radian) => radian * (180 / Math.PI);

//   const R = 6371e3; // Earth radius in meters
//   const delta = distance / R;

//   const startLat = toRadians(start.lat);
//   const startLon = toRadians(start.lon);
//   const endLat = toRadians(end.lat);
//   const endLon = toRadians(end.lon);

//   const latDiff = endLat - startLat;
//   const lonDiff = endLon - startLon;

//   const newLat = Math.asin(
//     Math.sin(startLat) * Math.cos(delta) +
//       Math.cos(startLat) * Math.sin(delta) * Math.cos(latDiff)
//   );
//   const newLon =
//     startLon +
//     Math.atan2(
//       Math.sin(lonDiff) * Math.sin(delta) * Math.cos(startLat),
//       Math.cos(delta) - Math.sin(startLat) * Math.sin(newLat)
//     );

//   return { lat: toDegrees(newLat), lon: toDegrees(newLon) };
// };

// const simulateOrderMovement = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/order/me`, {
//       headers: {
//         Authorization: AUTH_TOKEN, // Include the token in the header
//       },
//     });
//     const orders = response.data.allOrders;

//     for (let order of orders) {
//       const storeAddress = "NBH1, 4killo King George VI St, Addis Ababa";
//       const userAddress = `${order.user.address}, ${order.user.city}`; // Adjust as per your address structure

//       console.log(`Processing order: ${order._id}`);
//       console.log(`Store address: ${storeAddress}`);
//       console.log(`User address: ${userAddress}`);

//       const storeCoordinates = await geocodeAddress(storeAddress);
//       const userCoordinates = await geocodeAddress(userAddress);

//       console.log(`Store coordinates: ${JSON.stringify(storeCoordinates)}`);
//       console.log(`User coordinates: ${JSON.stringify(userCoordinates)}`);

//       const currentCoordinates =
//         order.locations.length > 1
//           ? await geocodeAddress(order.locations[order.locations.length - 1])
//           : storeCoordinates;

//       console.log(`Current coordinates: ${JSON.stringify(currentCoordinates)}`);

//       // Calculate the next location by moving 100 meters
//       const nextCoordinates = calculateNextLocation(
//         currentCoordinates,
//         userCoordinates,
//         100
//       );

//       console.log(`Next coordinates: ${JSON.stringify(nextCoordinates)}`);

//       // Reverse geocode to get the address from coordinates
//       const nextLocation = await reverseGeocodeCoordinates(
//         nextCoordinates.lat,
//         nextCoordinates.lon
//       );

//       console.log(`Next location: ${nextLocation}`);
//       const nextLocationName = [nextLocation];

//       // Update the order location in the database
//       await axios.put(
//         `${API_URL}/order/location/${order._id}`,
//         { locations: nextLocationName },
//         {
//           headers: {
//             Authorization: AUTH_TOKEN, // Include the token in the header
//           },
//         }
//       );
//       console.log("Order location updated successfully");
//     }
//   } catch (error) {
//     console.error("Error simulating order movement:", error);
//     if (error.response) {
//       console.error("Error response data:", error.response.data);
//     } else if (error.request) {
//       console.error("Error request data:", error.request);
//     }
//   }
// };

// const startLocationUpdater = () => {
//   // Schedule the task to run every 1 minute for testing purposes (change to 3 minutes as needed)
//   cron.schedule("*/1 * * * *", simulateOrderMovement);
// };

// module.exports = startLocationUpdater;
