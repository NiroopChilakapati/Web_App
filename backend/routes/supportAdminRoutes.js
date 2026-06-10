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
      message: "Admin only",
    });
  }
};

/* ALL TICKETS */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* UPDATE STATUS */
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        returnDocument: "after",
      },
    );

    res.json({
      ticket,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
