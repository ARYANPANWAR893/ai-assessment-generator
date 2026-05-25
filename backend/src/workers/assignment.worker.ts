import mongoose from "mongoose";
import { Worker } from "bullmq";
import { connectDB } from "../lib/db";
import { redisConnection } from "../queue";

interface GenerationJobPayload {
  userId?: string;
  createdBy?: string;
  creatorEmail?: string;
  numberOfQuestions: number;
  marks: number;
  additionalInfo: string;
}

/**
 * ==========================================================
 * MAIN GENERATION FUNCTION
 * ==========================================================
 * Used by:
 * 1. Direct controller execution (production fallback)
 * 2. BullMQ worker queue
 */
export async function processAssignmentGeneration(
  job: {
    data: GenerationJobPayload;
  }
) {
  const {
    numberOfQuestions,
    marks,
    additionalInfo,
    userId,
    createdBy,
    creatorEmail,
  } = job.data;

  console.log(
    `🚀 [WORKER START] Processing assignment: ${
      additionalInfo || "Untitled"
    }`
  );

  await connectDB();

  try {
    // ==================================================
    // Mock Question Generation Logic
    // ==================================================
    const generatedQuestions =
      Array.from(
        {
          length:
            numberOfQuestions || 1,
        },
        (_, index) => ({
          questionId: `q${
            index + 1
          }`,
          text: `Question ${
            index + 1
          }: ${
            additionalInfo ||
            "General Topic"
          }`,
          type:
            "subjective",
          points:
            Math.round(
              marks /
                numberOfQuestions
            ) || 5,
        })
      );

    // ==================================================
    // Assignment Document
    // ==================================================
    const assignmentPayload =
      {
        userId:
          userId || null,

        createdBy:
          createdBy ||
          "Aryan Panwar",

        creatorEmail:
          creatorEmail ||
          "",

        additionalInfo:
          additionalInfo ||
          "Generated Assignment",

        status:
          "completed",

        createdAt:
          new Date(),

        config: {
          numberOfQuestions,
          marks,
          dueDate:
            "Inline Generation",
        },

        questions:
          generatedQuestions,
      };

    // ==================================================
    // Save to MongoDB
    // ==================================================
    if (
      mongoose.connection
        .readyState >= 1
    ) {
      const AssignmentModel =
        mongoose.models
          .Assignment ||
        mongoose.model(
          "Assignment",
          new mongoose.Schema(
            {},
            {
              strict: false,
            }
          )
        );

      const savedDocument =
        await AssignmentModel.create(
          assignmentPayload
        );

      console.log(
        `✅ Assignment saved: ${savedDocument._id}`
      );
    } else {
      console.warn(
        "⚠️ MongoDB not connected"
      );
    }

    console.log(
      "📡 Generation completed"
    );

    return {
      success: true,
      payload:
        assignmentPayload,
    };
  } catch (error) {
    console.error(
      "❌ Worker crashed:",
      error
    );

    throw error;
  }
}

/**
 * ==========================================================
 * BullMQ Worker
 * ==========================================================
 * Still preserved for architecture completeness
 */
const worker = new Worker(
  "assignment-generation",
  async (job) => {
    return processAssignmentGeneration(
      job as any
    );
  },
  {
    connection:
      redisConnection,
  }
);

// Worker Success Logs
worker.on(
  "completed",
  (job) => {
    console.log(
      `✅ Job completed: ${job.id}`
    );
  }
);

// Worker Failure Logs
worker.on(
  "failed",
  (job, err) => {
    console.error(
      `❌ Job failed: ${job?.id}`,
      err
    );
  }
);

console.log(
  "👷 Assignment Worker Running"
);