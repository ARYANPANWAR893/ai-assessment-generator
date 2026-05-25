import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";

import assignmentRoutes from "./routes/assignment.routes";
import { initializeWebSocketServer } from "./sockets/websocket.handler";

// Load BullMQ worker on server startup
import "./workers/assignment.worker";

const app = express();
const server = http.createServer(app);

// =========================================================
// Environment Variables
// =========================================================
const PORT = process.env.PORT || 8080;

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:3000";

// =========================================================
// CORS Configuration
// =========================================================
app.use(
  cors({
    origin: CLIENT_URL,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  })
);

// Handle browser preflight requests
app.options("*", cors() as any);

// =========================================================
// Middleware
// =========================================================
app.use(express.json());

// =========================================================
// Routes
// =========================================================
app.use("/api", assignmentRoutes);

// Health Route
// Helps Render verify deployment
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message:
      "AI Assessment Generator API running",
  });
});

// =========================================================
// WebSocket Initialization
// =========================================================
initializeWebSocketServer(server);

// =========================================================
// Server Bootstrap
// =========================================================
const startServer = async () => {
  try {
    // MongoDB connection only if URI exists
    if (process.env.MONGO_URI) {
      await mongoose.connect(
        process.env.MONGO_URI
      );

      console.log(
        "✅ MongoDB connected"
      );
    } else {
      console.warn(
        "⚠️ MONGO_URI missing. Continuing without database."
      );
    }

    server.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error
    );

    // Still boot server for deployment
    server.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });
  }
};

startServer();