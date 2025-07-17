// src/routes/note.ts
import express from "express";
import { getNotes, createNote } from "../controllers/noteController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/:candidateId", requireAuth, getNotes);
router.post("/:candidateId", requireAuth, createNote);  // ← error here

export default router;
