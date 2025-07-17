import express from "express";
import { getCandidates, createCandidate } from "../controllers/candidateController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, getCandidates);
router.post("/", requireAuth, createCandidate);

export default router;
