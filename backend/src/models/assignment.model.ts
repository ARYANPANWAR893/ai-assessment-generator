import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    additionalInfo: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["queued", "generating", "structuring", "completed", "failed"], 
      default: "queued" 
    },
    progress: { type: Number, default: 0 },
    questionRows: { type: Array, default: [] },
    
    // Explicitly nested configuration properties
    config: {
      dueDate: { type: String, required: true },
      marks: { type: Number, required: true },
      numberOfQuestions: { type: Number, required: true },
    },

    // ✅ Crucial Fix: Tells Mongoose to allow and persist the raw structured JSON payload from Groq
    generatedContent: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  { timestamps: true }
);

export const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);