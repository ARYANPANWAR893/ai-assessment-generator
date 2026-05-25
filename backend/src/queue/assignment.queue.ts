import { Queue } from "bullmq";
import IORedis from "ioredis";

// Standard local Redis connection config
export const redisConnection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

export const assignmentQueue = new Queue("assignment-generation", {
  connection: redisConnection,
});