
import { model } from "mongoose";
import contect_shema from "../Schema/Contectschema.js";

const Contect_model = model(
  "contect",
  contect_shema,
  "contect"
);

export default Contect_model;
