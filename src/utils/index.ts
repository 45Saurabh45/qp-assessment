import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const generateToken = (user: { id: number, is_admin: boolean }) => {
    return jwt.sign(
      { id: user.id, role: user.is_admin ? true : false }, 
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  };
  

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
