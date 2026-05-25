"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FileText, PlusCircle, ArrowRight, Layers, Award } from "lucide-react";

export default function HomeDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ai-assessment-generator.onrender.com/api/assignments-list")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setRecentItems(data.slice(0, 3)); 
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full space-y-8 font-sans">
      
      {/* Welcome Message Segments */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Welcome back, {user?.name || "Aryan panwar"}
        </h1>
        <p className="text-xs text-neutral-400 font-medium">
          Here is a quick look at your workspace activity and assessment metrics.
        </p>
      </div>

      {/* Flagship Fast Track Creation Panel */}
      <div className="bg-neutral-50/70 border border-neutral-200 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-neutral-800">Generate a New Paper</h3>
          <p className="text-xs text-neutral-400 font-medium max-w-xl leading-relaxed">
            Deploy our Groq pipeline to parse syllabi or images into an assessment blueprint instance instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/create")}
          className="h-9 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all self-start sm:self-center shrink-0 shadow-sm"
        >
          <PlusCircle size={14} />
          <span>Launch Generator</span>
        </button>
      </div>

      {/* Historical Track Log Grid Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">Recent Workspace Blueprints</h2>
          {recentItems.length > 0 && (
            <button 
              onClick={() => router.push("/assignments")}
              className="text-xs font-bold text-neutral-900 hover:underline inline-flex items-center gap-1 focus:outline-none"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="h-24 flex items-center justify-center border border-neutral-200 border-dashed rounded-2xl">
            <div className="h-4 w-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-200 rounded-2xl">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Workspace Archive Empty</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Your generated assignments will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentItems.map((item) => (
              <div 
                key={item._id}
                onClick={() => router.push(`/assessment/${item._id}`)}
                className="p-4 border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/30 rounded-xl flex items-center justify-between gap-4 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 group-hover:text-orange-500 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all shrink-0">
                    <FileText size={15} />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-800 truncate group-hover:text-neutral-900">
                      {item.additionalInfo || "General Syllabus Evaluation Blueprint"}
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Status: {item.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0 text-[11px] font-bold text-neutral-500 group-hover:text-neutral-900 transition-colors">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Layers size={13} className="text-neutral-300 group-hover:text-neutral-400" />
                    <span>{item.config?.numberOfQuestions || 0} Questions</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Award size={13} className="text-neutral-300 group-hover:text-neutral-400" />
                    <span>{item.config?.marks || 0} Marks</span>
                  </div>
                  <ArrowRight size={14} className="text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}