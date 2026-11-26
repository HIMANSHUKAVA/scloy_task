import mongose from "mongoose";

const notification_schema = mongose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["order", "lowstock", "stockout", "contact", "cancellation"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default notification_schema;
