import { Worker } from "bullmq";
import { redisConnection } from "../queue/assignment.queue";
import { generateStructuredAssessmentData } from "../services/ai.service";
import { emitGenerationStatus } from "../sockets/websocket.handler";
import { Assignment } from "../models/assignment.model";

const worker = new Worker(
  "assignment-generation",
  async (job) => {
    const { assignmentId, config } = job.data;
    console.log(`\n[Worker Engine] ⚡ Processing Job for Assignment: ${assignmentId}`);

    try {
      // Step 1: Update status to generating
      emitGenerationStatus(assignmentId, "generating", 40);
      await Assignment.findByIdAndUpdate(assignmentId, { status: "generating" });

      // Step 2: Transition to structuring state
      emitGenerationStatus(assignmentId, "structuring", 75);
      const rawAiResponse = await generateStructuredAssessmentData(config);

      // Step 3: Handle potential string/object parsing variations defensively
      let structuredJson: any = null;
      if (typeof rawAiResponse === "string") {
        let cleanString = rawAiResponse.trim();
        if (cleanString.startsWith("```")) {
          cleanString = cleanString.replace(/^```json/, "").replace(/```$/, "").trim();
        }
        structuredJson = JSON.parse(cleanString);
      } else {
        structuredJson = rawAiResponse;
      }

      const finalSections = structuredJson?.sections || structuredJson?.data?.sections;

      if (!finalSections || !Array.isArray(finalSections)) {
        throw new Error("Groq payload did not resolve into a valid sections array.");
      }

      console.log(`[Worker Engine] Success: Validated ${finalSections.length} sections.`);

      // Step 4: Persist content to DB using the explicitly mapped object schema
      await Assignment.findByIdAndUpdate(
        assignmentId,
        {
          status: "completed",
          generatedContent: { sections: finalSections },
          progress: 100,
        }
      );

      // Step 5: Broadcast real-time completion stream down the websocket
      emitGenerationStatus(assignmentId, "completed", 100, { sections: finalSections });
      console.log(`[Worker Engine] 🎉 Database save and socket broadcast complete for: ${assignmentId}\n`);
    } catch (err) {
      console.error(`[Worker Engine] ❌ Critical Execution Error on job ${job.id}:`, err);
      await Assignment.findByIdAndUpdate(assignmentId, { status: "failed", progress: 100 });
      emitGenerationStatus(assignmentId, "failed", 100, { error: "Processing pipeline processing failed." });
    }
  },
  { connection: redisConnection }
);

export default worker;