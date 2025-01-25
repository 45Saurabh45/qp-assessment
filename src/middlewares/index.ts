import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "./../config";

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(403).send({ message: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; 
      next(); 
    } catch (error) {
      res.status(400).send({ message: "Invalid or expired token." });
    }
  };
  
  const isAdmin = (req, res, next) => {
    console.log(req.user)
    if (!req.user.role) {
      return res.status(403).send({ message: "Access denied. Admin privileges required." });
    }
    next();
  };
  
export { verifyToken, isAdmin };