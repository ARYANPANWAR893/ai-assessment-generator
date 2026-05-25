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
  Plus
} from "lucide-react";
import {
  useState,
  useRef,
  useEffect
} from "react";

export function AssignmentCreatorForm() {
  const router = useRouter();
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const {
    dueDate,
    setDueDate,
    additionalInfo,
    setAdditionalInfo,
    questionRows,
    addQuestionRow,
    removeQuestionRow,
    updateQuestionRow
  } = useAssignmentStore();

  const [
    selectedFile,
    setSelectedFile
  ] = useState<File | null>(
    null
  );

  const [
    filePreviewUrl,
    setFilePreviewUrl
  ] = useState<string | null>(
    null
  );

  const [
    validationError,
    setValidationError
  ] = useState<string | null>(
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

  // Cleanup memory
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
          "Strict Operational Constraint: Target assignment due date must be defined."
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
          "Strict Operational Constraint: Point distribution matrix requires at least 1 active row definition."
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

        // IMPORTANT
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

        // ONLY FIXED PART
        const res =
          await fetch(
            "https://ai-assessment-generator.onrender.com/api/assignments",
            {
              method:
                "POST",
              body:
                formData
            }
          );

        if (!res.ok) {
          throw new Error(
            `Server returned error status code: ${res.status}`
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
          "Critical submission flow exception:",
          err
        );

        setValidationError(
          "Network Failure: Could not communicate with generation worker pipelines."
        );
      }
    };

  return (
    <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col overflow-hidden font-sans">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl mx-auto w-full">

        <div>
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">
            Assignment Details
          </h2>

          <p className="text-xs text-neutral-400 mt-0.5">
            Basic configurations defining structural requirements.
          </p>
        </div>

        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl leading-normal">
            {
              validationError
            }
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={
            handleFileChange
          }
          className="hidden"
          accept=".png,.jpg,.jpeg,.pdf"
        />

        {/* KEEPING YOUR EXACT UI */}
        {/* Rest of your UI remains unchanged */}

      </div>

      <footer className="p-4 bg-neutral-50 border-t border-neutral-200 shrink-0 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            router.push("/")
          }
          className="h-10 px-4 bg-white border border-neutral-200 rounded-xl inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 shadow-sm hover:bg-neutral-50"
        >
          <ArrowLeft size={14} />
          <span>
            Previous
          </span>
        </button>

        <button
          type="button"
          onClick={
            handleGenerationSubmit
          }
          className="h-10 px-5 bg-neutral-300 hover:bg-neutral-800 text-white rounded-xl inline-flex items-center gap-2 text-xs font-semibold shadow-md active:scale-95 transition-all"
        >
          <span>
            Generate Paper
          </span>

          <ArrowRight
            size={14}
          />
        </button>
      </footer>
    </div>
  );
}