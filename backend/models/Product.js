const mongoose = require("mongoose");

const customizationFieldSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "textarea", "file", "number"],
      default: "text",
    },

    required: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const hamperItemSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "Custom Gift",
    },

    productType: {
      type: String,
      enum: ["polaroid", "frame", "bouquet", "letter Card", "hamper", "custom"],
      default: "custom",
    },

    stock: {
      type: Number,
      default: 10,
    },

    soldOut: {
      type: Boolean,
      default: false,
    },

    isHamper: {
      type: Boolean,
      default: false,
    },

    hamperItems: [hamperItemSchema],

    customizationFields: [customizationFieldSchema],
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
