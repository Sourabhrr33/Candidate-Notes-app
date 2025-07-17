// src/api/candidate.ts
import api from "./axios";

export const getCandidates = () =>
  api.get("/candidates").then((res) => res.data);

export const createCandidate = (candidate: { name: string; email: string }) =>
  api.post("/candidates", candidate).then((res) => res.data);
