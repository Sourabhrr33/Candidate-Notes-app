import express from "express";
import User from "../models/User"; // adjust the path as needed
import { requireAuth } from "../middleware/auth"; // adjust as per your project

const router = express.Router();

// GET /api/users — list all users except password
router.get("/", requireAuth, async (req, res) => {
  try {
    // Exclude password field
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
