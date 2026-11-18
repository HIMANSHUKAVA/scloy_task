import jwt from "jsonwebtoken";
import loginmodel from "../Model/LoginModel.js";

export function Generettoke(user) {
  return jwt.sign(
    {
      user_id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
}

export async function RagisterAPI(user) {
  const result = await loginmodel.create(user);
  return result;
}

export async function LoginApi(email) {
  const result = await loginmodel.findOne({ email });
  return result;
}

export async function GetRagisterdUser() {
  const result = await loginmodel.find({role : "User"}).select("-password");

  return result;
}
