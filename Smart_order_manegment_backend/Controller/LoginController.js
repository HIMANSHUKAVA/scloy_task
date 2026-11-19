import bcrypt from "bcryptjs";
import {
  DeleteById,
  Generettoke,
  GetRagisterdUser,
  GetUserById,
  LoginApi,
  RagisterAPI,
  ToggleActiveButton,
  UpdateById,
} from "../Model_API/Login.js";
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

    if (result.isActive === false) {
      return resp.status(500).json({
        message: "Admin Disabled Your Login Account Try Some Time Later",
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
      data: result,
    });
  } catch (error) {
    return resp.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function findbyid(req, resp) {
  try {
    const id = req.params.id;
    const result = await GetUserById(id);

    if (!result) {
      resp.status(500).json({
        message: "User Not FOounr",
      });
    }
    resp.status(201).json({
      message: "user found",
      deta: result,
    });
  } catch (error) {
    resp.status(500).json({
      message: "id method occured problem catch block executed",
    });
  }
}

export async function updatebyid(req, resp) {
  try {
    const id = req.params.id;
    const { username, email } = req.body;

    const result = await UpdateById(id, { username, email });

    if (!result) {
      return resp.status(404).json({
        message: "User not found",
      });
    }

    return resp.status(200).json({
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    if (error.message.includes("Email already registered")) {
       resp.status(409).json({
        message: error.message,
      });
    }

    return resp.status(500).json({
      message: "Update method failed",
      error: error.message,
    });
  }
}

export async function deletebyid(req, resp) {
  try {
    const id = req.params.id;
    const result = DeleteById(id);
    resp.status(201).json({
      message: "User Deleted",
    });
  } catch (error) {
    resp.status(500).json({
      message: "Error Occured by Deletd method",
    });
  }
}

export async function togglebutton(req, resp) {
  const id = req.params.id;
  const { isActive } = req.body;

  try {
    const result = await ToggleActiveButton(id, isActive);

    if (!result) {
      return resp.status(404).json({
        message: "User not found",
      });
    }

    return resp.status(200).json({
      message: result.isActive
        ? "User enabled successfully"
        : "User disabled successfully",
      isActive: result.isActive,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
}
