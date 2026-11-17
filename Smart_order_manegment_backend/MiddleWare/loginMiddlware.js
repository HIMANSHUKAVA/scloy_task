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
    next()
  } catch (error) {
    return resp.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
export async function HasRoleMiddlware(role) {
    
    return (req , resp , next)=>{
        if (role !== req.user.role){
            resp.status(402).json({
                message : "Access Denied"
            })
     
        }
        next()
    }
}