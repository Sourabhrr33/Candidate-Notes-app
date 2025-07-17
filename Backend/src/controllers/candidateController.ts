import { Request, Response } from "express";
import Candidate from "../models/Candidate";

// Get all candidates
export const getCandidates = async (_req: Request, res: Response) => {
  const candidates = await Candidate.find();
  res.json(candidates);
};

// Create candidate
export const createCandidate = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Name and email required" });
  const candidate = await Candidate.create({ name, email });
  res.status(201).json(candidate);
};
