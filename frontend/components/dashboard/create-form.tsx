"use client";

import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Calendar,
  ArrowLeft,
  ArrowRight,
  FileCheck,
  X,
  Plus,
} from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
} from "react";

export function AssignmentCreatorForm() {
  const router =
    useRouter();

  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const {
    dueDate,
    setDueDate,
    additionalInfo,
    setAdditionalInfo,
    questionRows,
    addQuestionRow,
    removeQuestionRow,
    updateQuestionRow,
  } =
    useAssignmentStore();

  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    filePreviewUrl,
    setFilePreviewUrl,
  ] =
    useState<string | null>(
      null
    );

  const [
    validationError,
    setValidationError,
  ] =
    useState<string | null>(
      null
    );

  const totalQuestions =
    questionRows.reduce(
      (acc, row) =>
        acc + row.count,
      0
    );

  const totalMarks =
    questionRows.reduce(
      (acc, row) =>
        acc +
        row.count *
          row.marks,
      0
    );

  // Cleanup image preview memory
  useEffect(() => {
    return () => {
      if (
        filePreviewUrl
      ) {
        URL.revokeObjectURL(
          filePreviewUrl
        );
      }
    };
  }, [filePreviewUrl]);

  const handleFileChange =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (
        e.target.files &&
        e.target.files[0]
      ) {
        const file =
          e.target.files[0];

        setSelectedFile(
          file
        );

        if (
          file.type.startsWith(
            "image/"
          )
        ) {
          setFilePreviewUrl(
            URL.createObjectURL(
              file
            )
          );
        } else {
          setFilePreviewUrl(
            null
          );
        }
      }
    };

  const handleGenerationSubmit =
    async () => {
      if (
        !dueDate.trim()
      ) {
        setValidationError(
          "Please select a due date."
        );
        return;
      }

      if (
        questionRows.length ===
          0 ||
        totalQuestions ===
          0
      ) {
        setValidationError(
          "Please add at least one question type."
        );
        return;
      }

      setValidationError(
        null
      );

      try {
        const formData =
          new FormData();

        formData.append(
          "dueDate",
          dueDate
        );

        formData.append(
          "additionalInfo",
          additionalInfo
        );

        formData.append(
          "questionRows",
          JSON.stringify(
            questionRows
          )
        );

        formData.append(
          "marks",
          totalMarks.toString()
        );

        formData.append(
          "numberOfQuestions",
          totalQuestions.toString()
        );

        if (
          selectedFile
        ) {
          formData.append(
            "file",
            selectedFile
          );
        }

        // ==================================
        // FIXED API URL
        // ==================================
        const API_URL =
          process.env
            .NEXT_PUBLIC_API_URL ||
          "http://localhost:8080";

        const res =
          await fetch(
            `${API_URL}/api/assignments`,
            {
              method:
                "POST",
              body:
                formData,
            }
          );

        if (!res.ok) {
          throw new Error(
            `Server returned status ${res.status}`
          );
        }

        const data =
          await res.json();

        if (
          data &&
          data.assignmentId
        ) {
          setSelectedFile(
            null
          );

          setFilePreviewUrl(
            null
          );

          router.push(
            `/generating/${data.assignmentId}`
          );
        }
      } catch (err) {
        console.error(
          "Submission failed:",
          err
        );

        setValidationError(
          "Network Failure: Could not communicate with generation system."
        );
      }
    };

  return (
    <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col overflow-hidden font-sans">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl mx-auto w-full">
        <div>
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">
            Assignment
            Details
          </h2>

          <p className="text-xs text-neutral-400 mt-0.5">
            Configure
            your
            assessment
            structure.
          </p>
        </div>

        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {
              validationError
            }
          </div>
        )}

        <input
          type="file"
          ref={
            fileInputRef
          }
          onChange={
            handleFileChange
          }
          className="hidden"
          accept=".png,.jpg,.jpeg,.pdf"
        />

        <div
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer"
        >
          {filePreviewUrl ? (
            <img
              src={
                filePreviewUrl
              }
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          ) : (
            <UploadCloud
              size={24}
            />
          )}

          <span className="text-xs mt-2">
            {selectedFile
              ? selectedFile.name
              : "Upload image or PDF"}
          </span>
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(
            e
          ) =>
            setDueDate(
              e.target
                .value
            )
          }
          className="w-full h-10 border rounded-lg px-3"
        />

        <textarea
          value={
            additionalInfo
          }
          onChange={(
            e
          ) =>
            setAdditionalInfo(
              e.target
                .value
            )
          }
          placeholder="Additional instructions..."
          className="w-full h-24 border rounded-xl p-3"
        />

        <div className="text-sm">
          Total Questions:{" "}
          {
            totalQuestions
          }
        </div>

        <div className="text-sm">
          Total Marks:{" "}
          {totalMarks}
        </div>
      </div>

      <footer className="p-4 border-t flex justify-between">
        <button
          onClick={() =>
            router.push(
              "/"
            )
          }
          className="px-4 py-2 border rounded-lg"
        >
          Back
        </button>

        <button
          onClick={
            handleGenerationSubmit
          }
          className="px-5 py-2 bg-neutral-900 text-white rounded-lg"
        >
          Generate
          Paper
        </button>
      </footer>
    </div>
  );
}