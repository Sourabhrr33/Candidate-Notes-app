// src/models/Notification.ts
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  noteId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  read: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
    noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
