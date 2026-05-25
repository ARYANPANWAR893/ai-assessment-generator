import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Force load environment variables before constructing the OpenAI instance
dotenv.config();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Utility helper to convert a local file path into a clean Base64 string for multimodal context ingestion
 */
function encodeImageToBase64(filePath: string): string {
  const resolvedPath = path.resolve(filePath);
  const fileBuffer = fs.readFileSync(resolvedPath);
  const extension = path.extname(resolvedPath).toLowerCase().replace(".", "");
  const mimeType = extension === "jpg" ? "image/jpeg" : `image/${extension}`;
  return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
}

export const generateStructuredAssessmentData = async (config: any): Promise<any> => {
  // Flagship high-performance text-only model
  let modelName = "llama-3.3-70b-versatile"; 
  let messageContent: any = "";

  const systemPrompt = `You are an elite academic curriculum designer and expert examiner.
Your task is to generate a highly professional, accurate, and completely structured question paper based on the provided user specifications.

CRITICAL OPERATIONAL RULES:
1. You MUST respond with a single, valid, raw JSON object matching the exact schema requested.
2. Do NOT include any markdown formatting wrappers (like \`\`\`json), conversational introduction text, or trailing explanations.
3. Ensure the total number of questions matches exactly: ${config.numberOfQuestions}.
4. Ensure the total calculated points sum of all generated questions matches exactly: ${config.marks} Marks.
5. Distribute difficulty values natively across "easy", "medium", and "hard".
6. Incorporate any additional instructions or provided context fields intelligently.

REQUIRED JSON SCHEMA RESPONSE:
{
  "sections": [
    {
      "title": "Section Title (e.g., Section A — Core Mechanics)",
      "instruction": "Explicit overall section directive guidelines statement.",
      "questions": [
        {
          "text": "The fully formed academic assessment question statement text inquiry.",
          "difficulty": "easy",
          "marks": 5
        }
      ]
    }
  ]
}`;

  const userPrompt = `Generate an assessment paper based on these configuration specs:
- Target Question Count: ${config.numberOfQuestions} Total Questions
- Target Marks Limit: ${config.marks} Total Cumulative Points
- Additional Instructions/Topic Scope: ${config.instructions || "General evaluation"}`;

  // Check if an image was uploaded and exists on disk
  let hasValidImage = false;
  if (config.uploadedFile && fs.existsSync(config.uploadedFile)) {
    const fileExtension = path.extname(config.uploadedFile).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".webp"].includes(fileExtension)) {
      hasValidImage = true;
    }
  }

  // 2. Format payload content structure to meet Groq's exact model expectations
  if (hasValidImage) {
    // FIX: Switch to the active production vision model ID
    modelName = "meta-llama/llama-4-scout-17b-16e-instruct";
    const base64DataUri = encodeImageToBase64(config.uploadedFile);
    
    // Vision models require an array of content objects
    messageContent = [
      { type: "text", text: userPrompt },
      { type: "image_url", image_url: { url: base64DataUri } }
    ];
    console.log(`[Groq Pipeline] Routing to Active Vision Layer via ${modelName}`);
  } else {
    // Text model STRICTLY requires a raw flat string to avoid a 400 validation error
    messageContent = userPrompt;
    console.log(`[Groq Pipeline] Routing to Text Layer via ${modelName}`);
  }

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      console.log(`[Groq Pipeline] Dispatching inference call to ${modelName} (Attempt ${attempts}/${maxAttempts})...`);
      
      const response = await groq.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: messageContent },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }, // Forces strict structural JSON output from the engine
      });

      const rawText = response.choices[0]?.message?.content || "";
      let cleanText = rawText.trim();
      
      // Clean off any accidental markdown block wrappers if the model passes them anyway
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
      }

      const parsedJson = JSON.parse(cleanText);
      
      // Structural validation verification step
      if (parsedJson && Array.isArray(parsedJson.sections)) {
        console.log("[Groq Pipeline] Structural evaluation passed perfectly.");
        return parsedJson;
      }
      
      throw new Error("Returned JSON array structure failed validation checks.");
    } catch (parseError) {
      console.warn(`[Groq Pipeline] Attempt ${attempts} failed parsing checks.`, parseError);
      if (attempts >= maxAttempts) {
        console.error("[Groq Pipeline] Execution limitations reached. Dropping into default layout fallbacks.");
        break;
      }
    }
  }

  // 5. Hardened Fallback Object Block to safeguard your frontend flow from crashing
  return {
    sections: [
      {
        title: "Section A — General Evaluation Core",
        instruction: "Answer all comprehensive analytical tracking problems cleanly.",
        questions: [
          {
            text: `Analyze core fundamental operational components regarding topic: ${config.instructions || "General Syllabus Evaluation"}.`,
            difficulty: "medium",
            marks: config.marks || 100
          }
        ]
      }
    ]
  };
};