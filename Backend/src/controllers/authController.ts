import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    console.log("req.body",req.body)
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ message: "User registered", user: { _id: user._id, name, email } });
  }catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Registration error", error: (err as Error).message || err });
      }
      
};

// Login User
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "10m" });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err });
  }
};
