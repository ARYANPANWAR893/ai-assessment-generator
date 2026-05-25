import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";

import assignmentRoutes from "./routes/assignment.routes";
import { initializeWebSocketServer } from "./sockets/websocket.handler";

// Start BullMQ worker on boot
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

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;

// =========================================================
// Middleware
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

app.options("*", cors() as any);

app.use(express.json());

// =========================================================
// Routes
// =========================================================
app.use("/api", assignmentRoutes);

// Health Check Route
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
// Server Startup
// =========================================================
const startServer = async () => {
  try {
    console.log(
      "🚀 Booting AI Assessment Generator..."
    );

    // Check env var exists
    if (!MONGO_URI) {
      console.warn(
        "⚠️ No Mongo URI found. Starting without database."
      );
    } else {
      console.log(
        "🔌 Connecting to MongoDB..."
      );

      await mongoose.connect(
        MONGO_URI
      );

      console.log(
        "✅ MongoDB connected"
      );
    }

    server.listen(
      Number(PORT),
      "0.0.0.0",
      () => {
        console.log(
          `🚀 Server running on port ${PORT}`
        );

        console.log(
          `🌍 Allowed frontend origin: ${CLIENT_URL}`
        );
      }
    );
  } catch (error: any) {
    console.error(
      "❌ MongoDB connection failed"
    );

    console.error(
      "Mongo error message:"
    );
    console.error(
      error?.message
    );

    console.error(
      "Full Mongo error:"
    );
    console.error(error);

    // Start server anyway
    server.listen(
      Number(PORT),
      "0.0.0.0",
      () => {
        console.log(
          `🚀 Server running on port ${PORT}`
        );
      }
    );
  }
};

startServer();