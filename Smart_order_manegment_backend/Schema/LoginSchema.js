import mongoose from "mongoose";


const loginschema = mongoose.Schema({
    username : String,
    password : String,
    role : String

})

export default loginschema