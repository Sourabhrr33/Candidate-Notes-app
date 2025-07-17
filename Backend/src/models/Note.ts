import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  candidateId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  taggedUserIds: Types.ObjectId[];
  createdAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    taggedUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<INote>("Note", NoteSchema);
