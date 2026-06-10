const express = require("express");
const razorpay = require("../config/razorpay");

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error("RAZORPAY ERROR:", err);

    res.status(500).json({
      message: "Failed to create payment order",
    });
  }
});

module.exports = router;
