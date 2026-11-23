import mongoose from "mongoose"
import  wishlist_schema from "../Schema/Wishlistschema.js"

const wishlist_model = mongoose.model("wishlist" , wishlist_schema , "wishlist");


export default wishlist_model
