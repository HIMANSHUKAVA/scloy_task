import bcrypt from "bcryptjs";
import { Generettoke, LoginApi, RagisterAPI } from "../Model_API/Login.js";

export async function ragisteruser(req, resp) {
  try {
    const { username, email, password} = req.body;

    // 1. Hash password
    const newpass = await bcrypt.hash(password, 10);

    // 2. Create user object
    const user = {
      username,
      email,
      password: newpass,
      role : "User"
    };

    // 3. Save user in database
    const result = await RagisterAPI(user);

    // 4. Generate token
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
