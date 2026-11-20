import { model } from "mongoose";
import product_schema from "../Schema/productschema.js";


const productmodel = model("product" , product_schema , "product");

export default productmodel