import { Request, Response } from "express";
import { Assignment } from "../models/assignment.model";
import { assignmentQueue } from "../queue/assignment.queue";

/**
 * Main controller handling incoming multipart assignment generation form dispatches.
 * Accurately aligns parameters with Mongoose sub-document path expectations.
 */
export const createAssignmentTask = async (req: Request, res: Response) => {
  try {
    const { dueDate, additionalInfo, questionRows, marks, numberOfQuestions } = req.body;
    const uploadedFile = req.file ? req.file.path : undefined;

    const parsedQuestionRows = typeof questionRows === "string" ? JSON.parse(questionRows) : questionRows;

    // 1. Structure parameters matching your Mongoose schema expectations ('config.*')
    const newAssignment = await Assignment.create({
      additionalInfo: additionalInfo || "",
      questionRows: parsedQuestionRows,
      status: "queued",
      progress: 10,
      config: {
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        marks: Number(marks) || 100,
        numberOfQuestions: Number(numberOfQuestions) || 10,
      }
    });

    const assignmentId = (newAssignment._id as string).toString();

    // 2. Safely push data blocks into Redis-backed BullMQ processing worker tracks
    await assignmentQueue.add(`job-${assignmentId}`, {
      assignmentId,
      config: {
        numberOfQuestions: Number(numberOfQuestions) || 10,
        marks: Number(marks) || 100,
        instructions: additionalInfo || "",
        uploadedFile,
      },
    });

    // 3. Return an immediate HTTP 202 Accepted header code to unlock frontend transitions
    return res.status(202).json({
      success: true,
      message: "Assignment request appended to background processing queues cleanly.",
      assignmentId,
    });
  } catch (error) {
    console.error("Critical failure during controller processing pipeline execution:", error);
    return res.status(500).json({ error: "Failed to initialize assignment workspace generation routes." });
  }
};

/**
 * Targeted retrieval checkpoint supplying assignment details to the frontend loading/canvas pages.
 */
export const getAssignment = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || id === "undefined" || id.length !== 24) {
    return res.status(400).json({ error: "Invalid dynamic parameter identity criteria parsed." });
  }

  try {
    const item = await Assignment.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Target data instance not located in database collection mappings." });
    }
    return res.status(200).json(item);
  } catch (error) {
    console.error("Internal retrieval runtime handling exception caught:", error);
    return res.status(500).json({ error: "Failed to collect database document information parameters." });
  }
};

/**
 * Controller enabling the on-canvas "Regenerate Assignment" capability
 */
export const triggerRegenerationRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await Assignment.findById(id);
    if (!record) {
      return res.status(404).json({ error: "Target database configuration records missing." });
    }

    // Reset database status pointers back to queued initialization layers
    await Assignment.findByIdAndUpdate(id, { status: "queued", progress: 10 });

    // Recalculate allocation variables from nested sub-document variables and push a regeneration job down to BullMQ
    const derivedQuestionsCount = record.config?.numberOfQuestions || 
      record.questionRows?.reduce((acc: number, r: any) => acc + (Number(r.count) || 0), 0) || 10;
      
    const derivedMarksSum = record.config?.marks || 
      record.questionRows?.reduce((acc: number, r: any) => acc + ((Number(r.count) || 0) * (Number(r.marks) || 0)), 0) || 100;

    await assignmentQueue.add(`regenerate-${id}`, {
      assignmentId: id,
      config: {
        numberOfQuestions: derivedQuestionsCount,
        marks: derivedMarksSum,
        instructions: record.additionalInfo || "",
      },
    });

    return res.status(202).json({ success: true, assignmentId: id });
  } catch (err) {
    console.error("Regeneration routing execution blocker exception handled safely:", err);
    return res.status(500).json({ error: "Regeneration queue allocation exception dropped safely." });
  }
};