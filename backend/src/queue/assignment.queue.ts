import { Queue } from "bullmq";
import IORedis from "ioredis";

// Create stable Redis connection
export const redisConnection =
  new IORedis(
    process.env.REDIS_URL!,
    {
      maxRetriesPerRequest:
        null,

      enableReadyCheck:
        false,

      lazyConnect:
        false,

      keepAlive:
        30000,

      connectTimeout:
        10000,

      retryStrategy(
        times
      ) {
        return Math.min(
          times * 50,
          2000
        );
      },

      reconnectOnError() {
        return true;
      },
    }
  );

// Queue instance
export const assignmentQueue =
  new Queue(
    "assignment-generation",
    {
      connection:
        redisConnection,
    }
  );