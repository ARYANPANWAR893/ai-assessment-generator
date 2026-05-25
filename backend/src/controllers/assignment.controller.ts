import { Request, Response } from "express";
import { Assignment } from "../models/assignment.model";
import { processAssignmentGeneration } from "../workers/assignment.worker";

/**
 * CREATE ASSIGNMENT
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

      const parsedQuestionRows =
        typeof questionRows ===
        "string"
          ? JSON.parse(
              questionRows
            )
          : questionRows;

      // Create assignment
      const newAssignment =
        await Assignment.create(
          {
            additionalInfo:
              additionalInfo ||
              "",

            questionRows:
              parsedQuestionRows,

            status:
              "generating",

            progress: 25,

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

      // ==================================
      // GENERATE CONTENT
      // ==================================
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
            },
          }
        );

      // ==================================
      // SAVE GENERATED CONTENT
      // ==================================
      await Assignment.findByIdAndUpdate(
        assignmentId,
        {
          status:
            "completed",

          progress: 100,

          generatedContent:
            generatedResult
              .payload
              .generatedContent,
        }
      );

      return res
        .status(200)
        .json({
          success: true,
          assignmentId,
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
 * GET ASSIGNMENT
 */
export const getAssignment =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } =
        req.params;

      const assignment =
        await Assignment.findById(
          id
        );

      if (!assignment) {
        return res
          .status(404)
          .json({
            error:
              "Assignment not found",
          });
      }

      return res
        .status(200)
        .json(
          assignment
        );
    } catch (error) {
      console.error(
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to fetch assignment",
        });
    }
  };

/**
 * REGENERATE ASSIGNMENT
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
              "Assignment not found",
          });
      }

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
            },
          }
        );

      await Assignment.findByIdAndUpdate(
        id,
        {
          status:
            "completed",

          progress: 100,

          generatedContent:
            result
              .payload
              .generatedContent,
        }
      );

      return res
        .status(200)
        .json({
          success: true,
          assignmentId:
            id,
        });
    } catch (error) {
      console.error(
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Regeneration failed",
        });
    }
  };