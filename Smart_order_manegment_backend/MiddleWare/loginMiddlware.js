import jwt from "jsonwebtoken";


export function VarifyTokenMiddlware(req, resp, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return resp.status(401).json({
        message: "JWT not provided",
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
export function HasRoleMiddlware(role) {
  return (req, resp, next) => {
    if (!req.user || req.user.role !== role) {
      return resp.status(403).json({
        message: "Access Denied",
      });
    }

    next();
  };
}

