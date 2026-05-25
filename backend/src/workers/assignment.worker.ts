import { Worker } from "bullmq";
import { connectDB } from "../lib/db";
import { redisConnection } from "../queue/assignment.queue";

interface GenerationJobPayload {
  userId?: string;
  createdBy?: string;
  creatorEmail?: string;
  numberOfQuestions: number;
  marks: number;
  additionalInfo: string;
}

export async function processAssignmentGeneration(
  job: {
    data: GenerationJobPayload;
  }
) {
  const {
    numberOfQuestions,
    marks,
    additionalInfo,
  } = job.data;

  console.log(
    `🚀 [WORKER START] ${additionalInfo}`
  );

  await connectDB();

  try {
    // ======================================
    // GENERATED QUESTIONS
    // ======================================
    const generatedQuestions =
      Array.from(
        {
          length:
            numberOfQuestions || 10,
        },
        (_, index) => ({
          id: index + 1,

          question: `Question ${
            index + 1
          } about ${
            additionalInfo ||
            "General Topic"
          }`,

          marks:
            Math.ceil(
              marks /
                numberOfQuestions
            ),

          type:
            index < 3
              ? "MCQ"
              : index < 6
              ? "Short Answer"
              : "Long Answer",
        })
      );

    // ======================================
    // FINAL CONTENT PAYLOAD
    // ======================================
    const generatedContent =
      {
        title:
          additionalInfo ||
          "Generated Assignment",

        totalQuestions:
          numberOfQuestions,

        totalMarks:
          marks,

        questions:
          generatedQuestions,
      };

    console.log(
      "✅ Content generated"
    );

    return {
      success: true,

      payload: {
        generatedContent,
      },
    };
  } catch (error) {
    console.error(
      "❌ Worker crashed:",
      error
    );

    throw error;
  }
}

// ======================================
// BULLMQ WORKER (KEPT FOR COMPATIBILITY)
// ======================================
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

worker.on(
  "completed",
  (job) => {
    console.log(
      `✅ Job completed ${job.id}`
    );
  }
);

worker.on(
  "failed",
  (job, err) => {
    console.error(
      `❌ Job failed ${job?.id}`,
      err
    );
  }
);

console.log(
  "👷 Assignment Worker Running"
);