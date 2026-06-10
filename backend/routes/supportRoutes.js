const express = require("express");
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

/* CUSTOMER: CREATE SUPPORT TICKET */
router.post("/", protect, async (req, res) => {
  try {
    const { orderId, issue, message } = req.body;

    const ticket = await SupportTicket.create({
      user: req.user.id,
      order: orderId,
      issue,
      message,
    });

    res.status(201).json({
      message: "Support request submitted successfully",
      ticket,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ADMIN: VIEW ALL SUPPORT TICKETS */
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("user", "name email")
      .populate("order")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ADMIN: MARK TICKET RESOLVED */
router.put("/:id/resolve", protect, adminOnly, async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true },
    )
      .populate("user", "name email")
      .populate("order");

    res.json({
      message: "Ticket resolved",
      ticket,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
