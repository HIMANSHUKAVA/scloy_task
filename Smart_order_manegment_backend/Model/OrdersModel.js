

import mongoose from "mongoose";
import OrderSchema from "../Schema/Orderschema.js";

const order_model = mongoose.model(
  "orders",
  OrderSchema,
  "orders"
);

export default order_model;

