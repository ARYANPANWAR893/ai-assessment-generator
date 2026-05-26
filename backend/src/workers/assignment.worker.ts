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
    // GROQ API CALL
    // ======================================
    const groqResponse =
      await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },

          body: JSON.stringify({
            model:
              "llama-3.3-70b-versatile",

            temperature: 0.7,

            messages: [
              {
                role: "system",
                content: `
You are an expert university professor.

Generate a high-quality structured question paper.

Rules:
- Create realistic academic questions
- Questions must be relevant to topic
- Include a mix of conceptual, short, numerical, and analytical questions
- Return ONLY JSON
- No markdown
- No explanations

Format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "marks": 5,
      "type": "MCQ | Short Answer | Long Answer | Numerical"
    }
  ]
}
                `,
              },

              {
                role: "user",
                content: `
Generate a ${numberOfQuestions}-question paper.

Topic:
${additionalInfo}

Total Marks:
${marks}
                `,
              },
            ],
          }),
        }
      );

    const groqData =
      await groqResponse.json();

    const rawOutput =
      groqData
        ?.choices?.[0]
        ?.message?.content;

    if (!rawOutput) {
      throw new Error(
        "No Groq response received."
      );
    }

    // ======================================
    // PARSE AI JSON
    // ======================================
    let parsed;

    try {
      parsed =
        JSON.parse(
          rawOutput
        );
    } catch {
      console.error(
        "❌ Failed parsing Groq JSON:",
        rawOutput
      );

      throw new Error(
        "Invalid AI response format."
      );
    }

    const generatedQuestions =
      parsed.questions || [];

    // ======================================
    // FINAL PAYLOAD
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
// BULLMQ WORKER
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