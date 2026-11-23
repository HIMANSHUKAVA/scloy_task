import mongoose from "mongoose"
import addtocart_schema from "../Schema/Addtocartschema.js"


const add_to_cart_model = mongoose.model("addtocart" , addtocart_schema , "addtocart")

export default add_to_cart_model