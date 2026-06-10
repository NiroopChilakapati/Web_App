const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderNumber: {
      type: String,
      unique: true,
    },

    deliveryDetails: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: String,
        price: Number,
        image: String,

        customizations: [
          {
            label: String,
            value: String,
            files: [String],
          },
        ],
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Accepted", "Making", "Shipped", "Delivered", "Cancelled"],
      default: "Accepted",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
