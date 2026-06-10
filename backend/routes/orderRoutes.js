const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Order routes working" });
});

const generateOrderNumber = () => {
  return `BX-${Date.now()}`;
};

/* PLACE ORDER + DELIVERY DETAILS + REDUCE STOCK */
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, deliveryDetails } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    if (
      !deliveryDetails ||
      !deliveryDetails.fullName ||
      !deliveryDetails.phone ||
      !deliveryDetails.address ||
      !deliveryDetails.city ||
      !deliveryDetails.pincode
    ) {
      return res.status(400).json({
        message: "Delivery details are required",
      });
    }

    for (const item of items) {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          message: `Invalid product id for ${item.name}`,
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `${item.name} not found in products`,
        });
      }

      if (product.stock <= 0 || product.soldOut) {
        return res.status(400).json({
          message: `${product.name} is sold out`,
        });
      }
    }

    const order = await Order.create({
      user: req.user.id,
      orderNumber: generateOrderNumber(),
      deliveryDetails,
      items,
      totalAmount,
      status: "Accepted",
    });

    for (const item of items) {
      const product = await Product.findById(item.productId);

      product.stock = product.stock - 1;
      product.soldOut = product.stock <= 0;

      await product.save();
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* CUSTOMER ORDERS */
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("MY ORDERS ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
