import mongoose, { Schema, Document } from "mongoose";

export interface ICandidate extends Document {
  name: string;
  email: string;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<ICandidate>("Candidate", CandidateSchema);
