import { Request, Response } from "express";
import { Assignment } from "../models/assignment.model";
import { processAssignmentGeneration } from "../workers/assignment.worker";

/**
 * Create Assignment
 * Direct execution mode (BullMQ bypassed for deployment stability)
 */
export const createAssignmentTask =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        dueDate,
        additionalInfo,
        questionRows,
        marks,
        numberOfQuestions,
      } = req.body;

      const uploadedFile =
        req.file
          ? req.file.path
          : undefined;

      const parsedQuestionRows =
        typeof questionRows ===
        "string"
          ? JSON.parse(
              questionRows
            )
          : questionRows;

      // Create queued assignment
      const newAssignment =
        await Assignment.create(
          {
            additionalInfo:
              additionalInfo ||
              "",

            questionRows:
              parsedQuestionRows,

            status:
              "queued",

            progress: 10,

            config: {
              dueDate:
                dueDate ||
                new Date()
                  .toISOString()
                  .split(
                    "T"
                  )[0],

              marks:
                Number(
                  marks
                ) || 100,

              numberOfQuestions:
                Number(
                  numberOfQuestions
                ) || 10,
            },
          }
        );

      const assignmentId =
        (
          newAssignment._id as string
        ).toString();

      console.log(
        `🚀 Direct generation started: ${assignmentId}`
      );

      // ==================================================
      // DIRECT WORKER EXECUTION (NO REDIS)
      // ==================================================
      const generatedResult =
        await processAssignmentGeneration(
          {
            data: {
              numberOfQuestions:
                Number(
                  numberOfQuestions
                ) || 10,

              marks:
                Number(
                  marks
                ) || 100,

              additionalInfo:
                additionalInfo ||
                "",

              userId:
                assignmentId,

              createdBy:
                "Aryan Panwar",

              creatorEmail:
                "",
            },
          }
        );

      // Update saved assignment
      await Assignment.findByIdAndUpdate(
        assignmentId,
        {
          status:
            "completed",

          progress: 100,

          questions:
            generatedResult
              .payload
              .questions,
        }
      );

      return res
        .status(200)
        .json({
          success: true,
          assignmentId,
          data:
            generatedResult.payload,
        });
    } catch (error) {
      console.error(
        "❌ Assignment generation failed:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to generate assignment.",
        });
    }
  };

/**
 * Get Assignment
 */
export const getAssignment =
  async (
    req: Request,
    res: Response
  ) => {
    const { id } =
      req.params;

    if (
      !id ||
      id ===
        "undefined" ||
      id.length !== 24
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid assignment id.",
        });
    }

    try {
      const item =
        await Assignment.findById(
          id
        );

      if (!item) {
        return res
          .status(404)
          .json({
            error:
              "Assignment not found.",
          });
      }

      return res
        .status(200)
        .json(item);
    } catch (error) {
      console.error(
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to fetch assignment.",
        });
    }
  };

/**
 * Regenerate Assignment
 */
export const triggerRegenerationRequest =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } =
        req.params;

      const record =
        await Assignment.findById(
          id
        );

      if (!record) {
        return res
          .status(404)
          .json({
            error:
              "Assignment not found.",
          });
      }

      await Assignment.findByIdAndUpdate(
        id,
        {
          status:
            "queued",
          progress: 10,
        }
      );

      const result =
        await processAssignmentGeneration(
          {
            data: {
              numberOfQuestions:
                record
                  .config
                  ?.numberOfQuestions ||
                10,

              marks:
                record
                  .config
                  ?.marks ||
                100,

              additionalInfo:
                record.additionalInfo ||
                "",

              userId:
                id,
            },
          }
        );

      await Assignment.findByIdAndUpdate(
        id,
        {
          status:
            "completed",

          progress: 100,

          questions:
            result.payload
              .questions,
        }
      );

      return res
        .status(200)
        .json({
          success: true,
          assignmentId:
            id,
        });
    } catch (err) {
      console.error(
        err
      );

      return res
        .status(500)
        .json({
          error:
            "Regeneration failed.",
        });
    }
  };