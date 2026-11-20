
import mongoose from "mongoose";

const product_schema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    productImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);



export default product_schema;
