const express = require("express");
const Feedback = require("../models/Feedback");
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

/* CUSTOMER: CREATE FEEDBACK */
router.post("/", protect, async (req, res) => {
  try {
    const { orderId, rating, message } = req.body;

    const feedback = await Feedback.create({
      user: req.user.id,
      order: orderId,
      rating,
      message,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ADMIN: VIEW ALL FEEDBACK */
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .populate("order")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
