const express = require("express");

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Feedback = require("../models/Feedback");
const SupportTicket = require("../models/SupportTicket");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "superadmin")
  ) {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }
};

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({
      role: { $in: ["admin", "superadmin"] },
    });

    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({
      soldOut: false,
    });
    const soldOutProducts = await Product.countDocuments({
      soldOut: true,
    });

    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      status: "Cancelled",
    });

    const feedbackCount = await Feedback.countDocuments();
    const supportTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({
      status: "Open",
    });

    const orders = await Order.find();

    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      totalUsers,
      admins,
      totalProducts,
      activeProducts,
      soldOutProducts,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      feedbackCount,
      supportTickets,
      openTickets,
      revenue,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
