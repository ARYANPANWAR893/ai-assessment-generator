"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  ArrowLeft,
  FileText,
  Download,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    assignmentId: string;
  }>;
}

export default function AssignmentPreviewCanvasPage({
  params,
}: PageProps) {
  const router =
    useRouter();

  const {
    assignmentId,
  } = use(params);

  const [
    assignment,
    setAssignment,
  ] = useState<any>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    isRegenerating,
    setIsRegenerating,
  ] = useState(false);

  const fetchAssignmentData =
    async () => {
      try {
        const res =
          await fetch(
            `https://ai-assessment-generator.onrender.com/api/assignments/${assignmentId}`
          );

        if (res.ok) {
          const data =
            await res.json();

          setAssignment(
            data
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch assignment:",
          err
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    if (
      assignmentId
    ) {
      fetchAssignmentData();
    }
  }, [
    assignmentId,
  ]);

  const handleRegenerateAction =
    async () => {
      setIsRegenerating(
        true
      );

      try {
        const res =
          await fetch(
            `https://ai-assessment-generator.onrender.com/api/assignments/${assignmentId}/regenerate`,
            {
              method:
                "POST",
            }
          );

        if (
          res.ok
        ) {
          await fetchAssignmentData();
        }
      } catch (error) {
        console.error(
          "Regeneration failed:",
          error
        );
      } finally {
        setIsRegenerating(
          false
        );
      }
    };

  const handleExportBlueprint =
    () => {
      window.print();
    };

  if (
    loading
  ) {
    return (
      <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex items-center justify-center p-6">
        <RefreshCw
          className="text-neutral-300 animate-spin"
          size={24}
        />
      </div>
    );
  }

  // FIXED DATA PATH
  const questions =
    assignment
      ?.generatedContent
      ?.questions ||
    [];

  return (
    <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col overflow-hidden font-sans">

      <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText
              className="text-orange-500"
              size={18}
            />
            <h1 className="text-base font-bold text-neutral-900 tracking-tight">
              Evaluation Sheet Preview
            </h1>
          </div>

          <p className="text-xs text-neutral-400">
            Target Count:{" "}
            {
              assignment
                ?.config
                ?.numberOfQuestions
            }{" "}
            Questions • Combined Weight:{" "}
            {
              assignment
                ?.config
                ?.marks
            }{" "}
            Total Marks
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            disabled={
              isRegenerating
            }
            onClick={
              handleRegenerateAction
            }
            className="h-9 px-3.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={
                isRegenerating
                  ? "animate-spin"
                  : ""
              }
            />
            <span>
              Regenerate
              Content
            </span>
          </button>

          <button
            type="button"
            onClick={
              handleExportBlueprint
            }
            className="h-9 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-sm"
          >
            <Download
              size={14}
            />
            <span>
              Export
              Blueprint
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="hidden print:block border-b-2 border-neutral-800 pb-4 mb-6">
          <h1 className="text-2xl font-black text-neutral-900 uppercase">
            Assessment
            Examination
            Paper
          </h1>

          <div className="flex justify-between text-xs font-bold text-neutral-600 mt-2">
            <span>
              Total
              Questions:{" "}
              {
                assignment
                  ?.config
                  ?.numberOfQuestions
              }
            </span>

            <span>
              Max
              Marks:{" "}
              {
                assignment
                  ?.config
                  ?.marks
              }
            </span>
          </div>
        </div>

        {questions.length ===
        0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-200 rounded-2xl">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              No
              Questions
              Generated
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map(
              (
                question: any,
                idx: number
              ) => (
                <div
                  key={
                    idx
                  }
                  className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">
                        Q
                        {idx +
                          1}
                      </h3>

                      <p className="text-sm text-neutral-700 mt-2 leading-relaxed">
                        {
                          question.question
                        }
                      </p>
                    </div>

                    <div className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-lg">
                      {
                        question.marks
                      }{" "}
                      Marks
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <footer className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center shrink-0">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/create"
            )
          }
          className="h-10 px-4 bg-white border border-neutral-200 rounded-xl inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 shadow-sm hover:bg-neutral-50"
        >
          <ArrowLeft
            size={14}
          />
          <span>
            Back to
            Workspace
          </span>
        </button>
      </footer>
    </div>
  );
}