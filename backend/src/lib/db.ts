import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  // 1. ✅ GRACEFUL BYPASS: Check if the connection string is completely missing
  if (!MONGODB_URI) {
    console.warn("\n⚠️  [DATABASE WARNING]: MONGODB_URI is not defined in environment variables.");
    console.warn("💡 Shifting persistence engine to [Volatile Memory Mode] for quick deployment.\n");
    return null;
  }

  // If already connected, reuse the active pool instance
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Prevents queries from hanging indefinitely if connection drops
    });
    console.log("✅ [DATABASE SUCCESS]: MongoDB Connected successfully.");
    return conn;
  } catch (error) {
    console.error("❌ [DATABASE ERROR]: Connection failed during initial boot setup:", error);
    // ✅ FALLBACK: Instead of killing the process, log the error and allow server initialization to continue
    console.warn("⚠️ Continuing backend startup in un-persisted memory mode.");
    return null;
  }
}