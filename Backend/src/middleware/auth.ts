// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = payload.userId;   // this is correct
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
