const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
const User = require("../../models/user");
const Order = require("../../models/order");
const Cart = require("../../models/cart");

const { CART_ITEM_STATUS } = require("../../constants");

// Analytics API to get the count of products
router.get("/products", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.status(200).json({ productCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Analytics API to get the count of categories
router.get("/categories", async (req, res) => {
  try {
    const categoryCount = await Category.countDocuments();
    res.status(200).json({ categoryCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Analytics API to get the count of users
router.get("/users", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Analytics API to get the count of orders
router.get("/orders", async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    res.status(200).json({ orderCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Analytics API to get the count of processing orders
router.get("/orders/processing", async (req, res) => {
  try {
    const processingOrdersCount = await Cart.countDocuments({
      "products.status": CART_ITEM_STATUS.Processing,
    });
    res.status(200).json({ processingOrdersCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Analytics API to get the count of delivered orders
router.get("/orders/delivered", async (req, res) => {
  try {
    const deliveredOrdersCount = await Cart.countDocuments({
      "products.status": CART_ITEM_STATUS.Delivered,
    });
    res.status(200).json({ deliveredOrdersCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/shipped", async (req, res) => {
  try {
    const shippedOrdersCount = await Cart.countDocuments({
      "products.status": CART_ITEM_STATUS.Shipped,
    });
    res.status(200).json({ shippedOrdersCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
