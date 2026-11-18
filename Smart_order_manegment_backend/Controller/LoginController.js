import bcrypt from "bcryptjs";
import { Generettoke, GetRagisterdUser, LoginApi, RagisterAPI } from "../Model_API/Login.js";
import loginmodel from "../Model/LoginModel.js";

export async function ragisteruser(req, resp) {
  try {
    const { username, email, password } = req.body;

    // 1. Check existing user
    const existingUser = await loginmodel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return resp.status(409).json({
        message: "Email already registered",
      });
    }

    // 2. Hash password
    const newpass = await bcrypt.hash(password, 10);

    // 3. Create user object
    const user = {
      username,
      email: email.trim().toLowerCase(),
      password: newpass,
      role: "User",
    };

    // 4. Save user
    const result = await RagisterAPI(user);

    // 5. Generate token
    const token = Generettoke(result);

    return resp.status(201).json({
      message: "User created successfully",
      data: {
        id: result._id,
        username: result.username,
        email: result.email,
        role: result.role,
      },
      token,
    });
  } catch (error) {
    // Duplicate email index error
    if (error.code === 11000) {
      return resp.status(409).json({
        message: "Email already registered",
      });
    }

    return resp.status(500).json({
      message: error.message,
    });
  }
}

export async function loginuser(req, resp) {
  try {
    const { email, password } = req.body;

    const result = await LoginApi(email);

    if (!result) {
      return resp.status(401).json({
        message: "Invalid username and password",
      });
    }

    const matched = await bcrypt.compare(password, result.password);

    if (!matched) {
      return resp.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = Generettoke(result);

    return resp.status(200).json({
      message: "Login successful",
      token,
      data: {
        id: result._id,
        username: result.username,
        email: result.email,
        role: result.role,
      },
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}


export async function getdeta(req, resp) {
  try {
    const result = await GetRagisterdUser();

    return resp.status(200).json({
      message: "Users fetched successfully",
      data: result
    });

  } catch (error) {
    return resp.status(500).json({
      message: "Something went wrong"
    });
  }
}