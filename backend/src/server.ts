import dotenv from "dotenv";
// Force environment variables to initialize at the absolute top of the stack
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import assignmentRoutes from "./routes/assignment.routes";
import { initializeWebSocketServer } from "./sockets/websocket.handler";

// Explicitly import the worker thread to bind BullMQ to the process on boot
import "./workers/assignment.worker"; 

const app = express();
const server = http.createServer(app);

// 1. Comprehensive CORS policy to completely avoid frontend "Failed to Fetch" issues
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Instantly intercept and approve browser OPTIONS preflight checks
app.options("*", cors() as any);

app.use(express.json());

// 2. Attach the assignment router under the standard /api prefix
app.use("/api", assignmentRoutes);

// 3. Mount the real-time WebSocket messaging layer onto the HTTP server instance
initializeWebSocketServer(server);

const PORT = 8080;
const HOST = "127.0.0.1";

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vedaai")
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(`Server executing active tasks on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Critical full-stack database initialization exception:", err);
  });