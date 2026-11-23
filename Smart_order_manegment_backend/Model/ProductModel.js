import mongoose from "mongoose";
import product_schema from "../Schema/productschema.js";

const product_model = mongoose.model(
  "Product",
  product_schema,
  "product"
);

export default product_model;