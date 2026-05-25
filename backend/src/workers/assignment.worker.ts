import mongoose from "mongoose";
import { Worker } from "bullmq";
import { connectDB } from "../lib/db";
import { redisConnection } from "../lib/queue";

interface GenerationJobPayload {
  userId?: string;
  createdBy?: string;
  creatorEmail?: string;
  numberOfQuestions: number;
  marks: number;
  additionalInfo: string;
}

// =======================================================
// Worker Logic
// =======================================================
async function processAssignmentGeneration(
  job: { data: GenerationJobPayload }
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
    `🚀 Processing Assignment: ${
      additionalInfo ||
      "Untitled"
    }`
  );

  await connectDB();

  try {
    const generatedQuestions =
      Array.from(
        {
          length:
            numberOfQuestions,
        },
        (_, i) => ({
          questionId: `q${
            i + 1
          }`,
          text: `Question ${
            i + 1
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
          additionalInfo,
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

      const saved =
        await AssignmentModel.create(
          assignmentPayload
        );

      console.log(
        "✅ Assignment Saved:",
        saved._id
      );
    }

    return {
      success: true,
      payload:
        assignmentPayload,
    };
  } catch (error) {
    console.error(
      "❌ Worker failed:",
      error
    );

    throw error;
  }
}

// =======================================================
// ACTUAL BULLMQ WORKER
// =======================================================
new Worker(
  "assignment-generation",
  async (job) => {
    return processAssignmentGeneration(
      job
    );
  },
  {
    connection:
      redisConnection,
  }
);

console.log(
  "👷 Assignment Worker Running"
);