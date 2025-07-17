// src/index.ts
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import authRoutes from "./routes/auth";
import candidateRoutes from "./routes/candidate";
import noteRoutes from "./routes/note";
import userRoutes from "./routes/user";
import notificationRoutes from "./routes/notification";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",    // tighten this in production
    methods: ["GET", "POST"],
  },
});

// Middleware: parse JSON & enable CORS
app.use(cors());
app.use(express.json());

// Mount your REST routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token as string | undefined;
  if (!token) return next(new Error("Authentication error"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    // attach userId for later
    socket.data.userId = payload.userId;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Socket.io event handlers
io.on("connection", (socket) => {
  const userId = socket.data.userId as string;
  console.log(`User ${userId} connected on socket ${socket.id}`);

  // Join the user-specific room for notifications
  socket.on("joinUser", () => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user_${userId}`);
  });

  // Join/leave candidate rooms for notes
  socket.on("joinRoom", (candidateId: string) => {
    socket.join(candidateId);
  });
  socket.on("leaveRoom", (candidateId: string) => {
    socket.leave(`room_${candidateId}`);
    console.log(`Socket ${socket.id} left room_${candidateId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected (${socket.id})`);
  });
});

// Make io available to your controllers
export { io };

// Connect to MongoDB & start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
