import { Router } from "express";
import { 
  createAssignmentTask, 
  getAssignment, 
  triggerRegenerationRequest 
} from "../controllers/assignment.controller";
import multer from "multer";
import os from "os";
import { Assignment } from "../models/assignment.model";

// Safe cross-platform fallback path for file processing streams
const upload = multer({ dest: os.tmpdir() });

const router = Router();

// 1. Core assignment creation endpoint
router.post("/assignments", upload.single("file"), createAssignmentTask);

// 2. Retrieval checkpoint for loading/canvas pages
router.get("/assignments/:id", getAssignment);

// 3. Regeneration queue execution endpoint
router.post("/assignments/:id/regenerate", triggerRegenerationRequest);


router.get("/assignments-list", async (req, res) => {
  try {
    const collection = await Assignment.find().sort({ createdAt: -1 });
    return res.status(200).json(collection);
  } catch (err) {
    return res.status(500).json({ error: "Failed to collect database data map arrays." });
  }
});

export default router;