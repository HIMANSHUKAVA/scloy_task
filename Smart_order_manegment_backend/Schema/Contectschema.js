
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    adminReply: {
      type: String,
      default: "",
      trim: true,
    },

    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);



export default contactSchema
