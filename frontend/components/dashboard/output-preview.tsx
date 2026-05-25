"use client";

import { useEffect, useState } from "react";
import { Download, CheckCircle } from "lucide-react";

export function DocumentPreviewCanvas({ assignmentId }: { assignmentId: string }) {
  const [paper, setPaper] = useState<any>(null);

  useEffect(() => {
    fetch(`https://ai-assessment-generator.onrender.com/api/assignments/${assignmentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.generatedPaper) setPaper(data.generatedPaper);
      });
  }, [assignmentId]);

  if (!paper) return <div className="p-6 text-xs text-neutral-400">Loading output layer metrics...</div>;

  return (
    <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
        <div className="bg-neutral-900 text-white rounded-2xl p-4 shadow-md max-w-3xl mx-auto w-full">
          <div className="flex items-start gap-3">
            <CheckCircle size={16} className="text-blue-400 mt-0.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <p className="text-xs text-neutral-200">Assignment payload compiled via live production schemas.</p>
              <button className="h-8 px-4 bg-white text-neutral-900 font-semibold rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm">
                <Download size={13} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Mapping Over Document Sections Layout */}
        <article className="bg-white border border-neutral-200 rounded-2xl p-8 max-w-3xl mx-auto w-full shadow-sm text-neutral-800 space-y-6">
          {paper.sections?.map((section: any, sIdx: number) => (
            <div key={sIdx} className="space-y-4">
              <div className="text-center bg-neutral-50 py-2 rounded text-xs font-bold tracking-wider text-neutral-900 uppercase">
                {section.title}
              </div>
              <p className="text-xs italic text-neutral-400 px-1">{section.instruction}</p>
              <ol className="space-y-3 text-xs list-decimal pl-4 leading-relaxed">
                {section.questions?.map((q: any, qIdx: number) => (
                  <li key={qIdx} className="pl-1">
                    <span className="font-bold mr-2 text-[10px] uppercase bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-500">
                      {q.difficulty}
                    </span>
                    {q.text} <span className="font-bold text-neutral-400">[{q.marks} Marks]</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}