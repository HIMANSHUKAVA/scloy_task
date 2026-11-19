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
  const result = await loginmodel.find({ role: "User" }).select("-password");

  return result;
}

export async function GetUserById(id) {
  const result = await loginmodel.findById(id);

  return result;
}

export async function UpdateById(id, user) {


  const existing_user =await  loginmodel.findOne({
    email : user.email,
    _id : {$ne: id},
  })

  if (existing_user) {
    throw new Error("Email already registered. Please use a different email.");
  }

  const result = await loginmodel.findByIdAndUpdate(id, user, {
    new: true,
    runValidators: true,
  });

  return result;
}

export async function DeleteById(id) {
  const result = await loginmodel.findByIdAndDelete(id);

  return result;
}

export async function ToggleActiveButton(id , isActive) {
  const result = await loginmodel.findByIdAndUpdate(
    id,
    {
      $set: {
        isActive: isActive,
      },
    },
    { new: true, runValidators: true },
  );
  return result;
}
