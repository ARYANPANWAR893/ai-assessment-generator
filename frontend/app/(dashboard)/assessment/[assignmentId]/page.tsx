"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ArrowLeft, FileText, Download } from "lucide-react";

interface PageProps {
  params: Promise<{ assignmentId: string }>;
}

export default function AssignmentPreviewCanvasPage({ params }: PageProps) {
  const router = useRouter();
  const { assignmentId } = use(params);

  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const fetchAssignmentData = async () => {
    try {
      const res = await fetch(`https://ai-assessment-generator.onrender.com/api/assignments/${assignmentId}`);
      if (res.ok) {
        const data = await res.json();
        setAssignment(data);
      }
    } catch (err) {
      console.error("Failed to collect document data indices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentData();
    }
  }, [assignmentId]);

  const handleRegenerateAction = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch(`https://ai-assessment-generator.onrender.com/api/assignments/${assignmentId}/regenerate`, {
        method: "POST"
      });
      if (res.ok) {
        router.push(`/generating/${assignmentId}`);
      }
    } catch (error) {
      console.error("Regeneration dispatch thread failure:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  // 🛠️ EXPORT BLUEPRINT PRINT FUNCTION:
  const handleExportBlueprint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex items-center justify-center p-6">
        <RefreshCw className="text-neutral-300 animate-spin" size={24} />
      </div>
    );
  }

  const sections = 
    assignment?.generatedContent?.sections || 
    assignment?.generatedContent?.data?.sections ||
    assignment?.sections || 
    [];

  return (
    <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col overflow-hidden font-sans">
      
      {/* Header Panel - Hides during print execution */}
      <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="text-orange-500" size={18} />
            <h1 className="text-base font-bold text-neutral-900 tracking-tight">Evaluation Sheet Preview</h1>
          </div>
          <p className="text-xs text-neutral-400">
            Target Count: {assignment?.config?.numberOfQuestions || 0} Questions • Combined Weight: {assignment?.config?.marks || 0} Total Marks
          </p>
        </div>

        {/* Top Actions Button Group */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            disabled={isRegenerating}
            onClick={handleRegenerateAction}
            className="h-9 px-3.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRegenerating ? "animate-spin" : ""} />
            <span>Regenerate Content</span>
          </button>
          
          {/* ✅ FIXED: Button wired to execute print layouts seamlessly */}
          <button
            type="button"
            onClick={handleExportBlueprint}
            className="h-9 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-sm"
          >
            <Download size={14} />
            <span>Export Blueprint</span>
          </button>
        </div>
      </div>

      {/* Main Question Sheet Area - Expands fully to use whole paper bounds during print */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 print:overflow-visible print:p-0">
        
        {/* Printable Header - Visible ONLY when printing */}
        <div className="hidden print:block border-b-2 border-neutral-800 pb-4 mb-6">
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Assessment Examination Paper</h1>
          <div className="flex justify-between text-xs font-bold text-neutral-600 mt-2">
            <span>Total Questions: {assignment?.config?.numberOfQuestions || 0}</span>
            <span>Max Marks: {assignment?.config?.marks || 0} Marks</span>
            <span>Due Date: {assignment?.config?.dueDate || ""}</span>
          </div>
          {assignment?.additionalInfo && (
            <p className="text-[11px] text-neutral-500 mt-2 border-l-2 border-neutral-300 pl-2 italic">
              Instructions: {assignment.additionalInfo}
            </p>
          )}
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-200 rounded-2xl print:hidden">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              No assessment content structure processed.
            </p>
          </div>
        ) : (
          sections.map((section: any, sIdx: number) => (
            <div key={sIdx} className="space-y-4 bg-neutral-50/30 border border-neutral-100 rounded-2xl p-4 print:bg-transparent print:border-0 print:p-0 print:page-break-inside-avoid">
              <div className="border-b border-neutral-100 pb-2.5 print:border-neutral-800">
                <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider print:text-sm">{section.title}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5 italic font-medium print:text-neutral-600">{section.instruction}</p>
              </div>

              <div className="space-y-3">
                {section.generatedContent?.questions?.map((question: any, qIdx: number) => (
                  <div key={qIdx} className="flex items-start justify-between gap-6 p-2 hover:bg-white rounded-xl border border-transparent hover:border-neutral-100 transition-all group print:border-0 print:p-1">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-neutral-800 leading-relaxed print:text-sm">
                        <span className="text-neutral-400 font-bold mr-1.5 print:text-neutral-900">{qIdx + 1}.</span>
                        {question.text}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border print:hidden ${
                        question.difficulty === 'hard' ? 'bg-red-50 text-red-600 border-red-100' :
                        question.difficulty === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md group-hover:text-neutral-900 transition-colors print:bg-transparent print:text-neutral-900 print:font-bold print:text-sm">
                        [{question.marks} Marks]
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Actions Bar - Hides during print execution */}
      <footer className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center shrink-0 print:hidden">
        <button
          type="button"
          onClick={() => router.push("/create")}
          className="h-10 px-4 bg-white border border-neutral-200 rounded-xl inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 shadow-sm hover:bg-neutral-50"
        >
          <ArrowLeft size={14} />
          <span>Back to Workspace</span>
        </button>
      </footer>
    </div>
  );
}