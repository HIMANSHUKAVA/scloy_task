import mongoose from "mongoose";
import loginschema from "../Schema/LoginSchema.js";

const loginmodel = mongoose.model("ragister" , loginschema  , "ragister")

export default loginmodel