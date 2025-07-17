// src/routes/notification.ts
import express from "express";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, getNotifications);
router.post("/:id/read", requireAuth, markAsRead);

export default router;
