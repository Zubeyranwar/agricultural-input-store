import toast, { Toaster } from "react-hot-toast";
const express = require("express");
const router = express.Router();
const Order = require("../../models/order");
const notificationMiddleware = async (req, res, next) => {
  try {
    // Fetch all orders
    const orders = await Order.find().populate("user");

    // Construct the notification message
    const notification = orders.map((order) => {
      return {
        orderId: order._id,
        status: order.status, // Assuming you have a status field in your Order model
        lastLocation:
          order.locations.length > 0
            ? order.locations[order.locations.length - 1]
            : "Store", // Assuming you have a locations field in your Order model
      };
    });

    // Attach the notification to the response object
    res.locals.notification = notification;

    // Call next middleware
    next();

    // Display toast notification
    // Here you can use your preferred toast library or implement your own toast component
    // For example, using a hypothetical toast library named 'myToastLibrary'
    toast("Orders fetched successfully");
  } catch (error) {
    // Handle errors
    console.error("Error fetching orders:", error);
    res.locals.notification = []; // Set empty notification if there's an error
    next();

    // Display error toast notification
    // For example, using the same hypothetical toast library
    toast("Error fetching orders. Please try again.", { type: "error" });
  }
};
