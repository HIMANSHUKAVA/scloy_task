import mongoose from "mongoose";

const loginschema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default loginschema;
