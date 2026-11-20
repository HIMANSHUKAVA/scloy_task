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

// import loginmodel from "../Model/LoginModel.js";

// export async function UserMiddlware(req, resp, next) {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return resp.status(401).json({
//         message: "Token required",
//       });
//     }

//     const decode = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await loginmodel.findById(decode.user_id);

//     if (!user || user.role !== "User") {
//       return resp.status(403).json({
//         message: "User access denied",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return resp.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// }

// export async function AdminMiddleware(req, resp, next) {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return resp.status(401).json({
//         message: "Token required",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await loginmodel.findById(decoded.user_id);

//     if (!user || user.role !== "Admin") {
//       return resp.status(403).json({
//         message: "Admin access denied",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return resp.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// }
