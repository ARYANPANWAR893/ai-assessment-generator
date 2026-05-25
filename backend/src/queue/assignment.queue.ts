import { Queue } from "bullmq";
import IORedis from "ioredis";

// Production-safe Redis connection
export const redisConnection =
  process.env.REDIS_URL
    ? new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
        connectTimeout: 10000,
        retryStrategy(times) {
          return Math.min(times * 50, 2000);
        },
      })
    : new IORedis(
        "redis://127.0.0.1:6379",
        {
          maxRetriesPerRequest: null,
        }
      );

// Queue
export const assignmentQueue =
  new Queue(
    "assignment-generation",
    {
      connection:
        redisConnection,
    }
  );

// Helpful logs
redisConnection.on(
  "connect",
  () => {
    console.log(
      "✅ Redis connected"
    );
  }
);

redisConnection.on(
  "error",
  (err) => {
    console.error(
      "❌ Redis error:",
      err.message
    );
  }
);