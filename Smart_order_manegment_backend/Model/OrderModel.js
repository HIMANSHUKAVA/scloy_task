import mongoose from "mongoose";
import client_order from "../Schema/healthschema.js";

const order = mongoose.model("Order", client_order, "order");

export default order;