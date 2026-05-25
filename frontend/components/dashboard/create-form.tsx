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

  // Handle local memory cleanup
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

        // Required by backend
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
          const errorText =
            await res.text();

          console.error(
            "Backend response:",
            errorText
          );

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
            {validationError}
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

        <div
          onClick={() =>
            fileInputRef.current?.click()
          }
          className={`border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer group min-h-[160px] ${
            selectedFile
              ? "border-blue-500 bg-blue-50/10"
              : "border-neutral-200 hover:border-neutral-300 bg-neutral-50/50"
          }`}
        >
          {filePreviewUrl ? (
            <div className="relative w-20 h-20 border border-neutral-200 rounded-lg overflow-hidden shadow-sm mb-2">
              <img
                src={
                  filePreviewUrl
                }
                alt="Material preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-white border border-neutral-100 rounded-xl flex items-center justify-center shadow-sm mb-3">
              {selectedFile ? (
                <FileCheck
                  size={20}
                  className="text-blue-600"
                />
              ) : (
                <UploadCloud
                  size={20}
                  className="text-neutral-400 group-hover:text-neutral-900"
                />
              )}
            </div>
          )}

          <span className="text-xs font-semibold text-neutral-800 truncate max-w-xs">
            {selectedFile
              ? `Selected: ${selectedFile.name}`
              : "Choose a file or drag & drop it here"}
          </span>

          <span className="text-[10px] text-neutral-400 mt-1">
            {selectedFile
              ? `${(
                  selectedFile.size /
                  1024 /
                  1024
                ).toFixed(
                  2
                )} MB`
              : "JPEG, PNG, PDF up to 10MB limits"}
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800">
            Due Date
          </label>

          <div className="relative flex items-center">
            <input
              type="date"
              value={
                dueDate
              }
              onChange={(
                e
              ) =>
                setDueDate(
                  e.target
                    .value
                )
              }
              className="w-full h-10 pl-3 pr-10 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all cursor-pointer"
            />

            <Calendar
              size={16}
              className="text-neutral-400 absolute right-3 pointer-events-none"
            />
          </div>
        </div>

        {/* KEEP REST OF UI EXACTLY SAME */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col items-end gap-1 text-xs font-bold text-neutral-500">
          <div>
            Total Questions :
            <span className="text-neutral-900">
              {" "}
              {
                totalQuestions
              }
            </span>
          </div>

          <div>
            Total Marks :
            <span className="text-neutral-900">
              {" "}
              {totalMarks}
            </span>
          </div>
        </div>
      </div>

      <footer className="p-4 bg-neutral-50 border-t border-neutral-200 shrink-0 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            router.push("/")
          }
          className="h-10 px-4 bg-white border border-neutral-200 rounded-xl inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 shadow-sm hover:bg-neutral-50"
        >
          <ArrowLeft
            size={14}
          />
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
            Generate
            Paper
          </span>

          <ArrowRight
            size={14}
          />
        </button>
      </footer>
    </div>
  );
}