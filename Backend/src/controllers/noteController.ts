// src/controllers/noteController.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Note from "../models/Note";
import Notification from "../models/Notification";
import { io } from "../index";  

// GET /api/notes/:candidateId
export const getNotes = async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;
  try {
    const notes = await Note.find({ candidateId })
      .populate("senderId", "name email")
      .populate("taggedUserIds", "name email");

    return res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    return res.status(500).json({ message: "Could not fetch notes" });
  }
};

// POST /api/notes/:candidateId
export const createNote = async (req: AuthRequest, res: Response) => {
  const { candidateId } = req.params;
  const senderId = req.userId;  // now reads from req.userId
  if (!senderId) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const { text, taggedUserIds = [] } = req.body;

  // 1) Save the note
  const note = await Note.create({ candidateId, senderId, text, taggedUserIds });

  // 2) Populate for front‑end
  const populated = await Note.findById(note._id)
  .populate("senderId", "name email")
  .populate("taggedUserIds", "name email");

// broadcast only the populated version:
  io.to(candidateId).emit("noteAdded", populated);

  // 4) Create + emit notifications for each tag
  const excerpt = text.length > 50 ? text.slice(0, 47) + "…" : text;
  for (const uid of taggedUserIds as string[]) {
    const notif = await Notification.create({
      userId: uid,
      candidateId,
      noteId: note._id,
      text: excerpt,
    });
    io.to(`user_${uid}`).emit("notification", notif);
  }

  res.status(201).json(populated);
};
