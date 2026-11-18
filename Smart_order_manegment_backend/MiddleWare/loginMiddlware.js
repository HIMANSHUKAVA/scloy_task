import jwt from "jsonwebtoken";

export async function VarifyTokenMiddlware(req, resp, next) {
  try {
    const header = req.header.authorization;

    if (!header) {
      resp.status(401).json({
        message: "jwt not provaided",
      });
    }
    const token = header.split(" ")[1];

    if (!token) {
      return resp.status(401).json({
        message: "Invalid token format",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    return resp.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
export async function HasRoleMiddlware(role) {
  return (req, resp, next) => {
    if (role !== req.user.role) {
      resp.status(402).json({
        message: "Access Denied",
      });
    }
    next();
  };
}


import loginmodel from "../Model/LoginModel.js";

export async function AdminMiddleware(req, resp, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return resp.status(401).json({
        message: "Token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await loginmodel.findById(decoded.user_id);

    if (!user || user.role !== "Admin") {
      return resp.status(403).json({
        message: "Admin access denied",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return resp.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
