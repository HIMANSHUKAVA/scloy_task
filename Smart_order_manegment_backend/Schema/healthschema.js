import mongoose from "mongoose";

 const client_order = mongoose.Schema({
    name : String,
    email : String,
    order : String
})

export default client_order