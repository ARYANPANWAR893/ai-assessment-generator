import { Assignment } from "../models/assignment.model";
import { generateStructuredAssessmentData } from "./ai.service";

export const simulateProcessing = (id: string) => {
  let progress = 0;
  
  const timer = setInterval(async () => {
    progress += 25;
    
    if (progress >= 100) {
      clearInterval(timer);
      try {
        const doc = await Assignment.findById(id);
        if (doc) {
          const aiPaper = await generateStructuredAssessmentData(doc.config);
          await Assignment.findByIdAndUpdate(id, {
            progress: 100,
            status: "completed",
            generatedPaper: aiPaper
          });
        }
      } catch (err) {
        await Assignment.findByIdAndUpdate(id, { status: "failed" });
      }
    } else {
      await Assignment.findByIdAndUpdate(id, { progress, status: "generating" });
    }
  }, 800);
};