const express = require("express");

const Product = require("../models/Product");
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

/* GET ALL PRODUCTS */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* GET SINGLE PRODUCT */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* FEATURED PRODUCTS */
router.get("/featured/latest", async (req, res) => {
  try {
    const featuredProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(4);

    res.json(featuredProducts);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ADD PRODUCT */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      productType,
      stock,
      soldOut,
      isHamper,
      hamperItems,
      customizationFields,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      productType,
      stock,
      soldOut: soldOut || stock <= 0,
      isHamper,
      hamperItems: hamperItems || [],
      customizationFields: customizationFields || [],
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* EDIT PRODUCT */
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      productType,
      stock,
      soldOut,
      isHamper,
      hamperItems,
      customizationFields,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        image,
        category,
        productType,
        stock,
        soldOut: soldOut || stock <= 0,
        isHamper,
        hamperItems: hamperItems || [],
        customizationFields: customizationFields || [],
      },
      { returnDocument: "after" },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("EDIT PRODUCT ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* UPDATE STOCK */
router.put("/:id/stock", protect, adminOnly, async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        stock,
        soldOut: stock <= 0,
      },
      { returnDocument: "after" },
    );

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* DELETE PRODUCT */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
      productId: req.params.id,
    });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
