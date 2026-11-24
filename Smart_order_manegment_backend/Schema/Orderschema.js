import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    // Unique Order Number
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Logged-in User ID
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Multiple Products in One Order
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          default: "",
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Price Calculation
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order Status
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Cancellation Request
    cancellation: {
      requested: {
        type: Boolean,
        default: false,
      },

      reason: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: ["Not Requested", "Pending", "Approved", "Rejected", "Cancelled"],

        default: "Not Requested",
      },

      requestedAt: {
        type: Date,
        default: null,
      },

      reviewedAt: {
        type: Date,
        default: null,
      },

      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },

    // Prevent Duplicate Stock Restoration
    stockRestored: {
      type: Boolean,
      default: false,
    },

    // Order Status History
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },

        updatedAt: {
          type: Date,
          default: Date.now,
        },

        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },

        note: {
          type: String,
          default: "",
        },
      },
    ],
  },

  {
    timestamps: true,
  },
);

export default OrderSchema;
