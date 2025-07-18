// src/controllers/notificationController.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";   
import Notification from "../models/Notification";

// GET /api/notifications
export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;                         
  if (!userId) {
    console.error("getNotifications: no req.userId", req.headers.authorization);
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const notifs = await Notification.find({ userId })
      .populate("candidateId", "name")
      .populate("noteId", "text")
      .sort({ createdAt: -1 });
    return res.json(notifs);
  } catch (err) {
    console.error("Error in getNotifications:", err);
    return res.status(500).json({ message: "Server error retrieving notifications" });
  }
};

// POST /api/notifications/:id/read
export const markAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Not authorized" });

  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    return res.json(notif);
  } catch (err) {
    console.error("Error in markAsRead:", err);
    return res.status(500).json({ message: "Could not mark notification as read" });
  }
};
