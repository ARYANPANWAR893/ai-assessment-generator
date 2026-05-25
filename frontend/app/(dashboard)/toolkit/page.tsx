"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, BrainCircuit, Sliders, CheckSquare, Wand2 } from "lucide-react";

export default function TeacherToolkitTab() {
  const router = useRouter();
  
  const actions = [
    { title: "Generate MCQ Quiz", desc: "Build objective structured question models via LLM pipeline instantly.", icon: <BrainCircuit className="text-purple-500" size={16} /> },
    { title: "Bloom’s Taxonomy Analysis", desc: "Evaluate mapping cognitive matrices alignment standards.", icon: <Sparkles className="text-amber-500" size={16} /> },
    { title: "Difficulty Curve Balancer", desc: "Re-distribute metrics tracking variance algorithms cleanly.", icon: <Sliders className="text-blue-500" size={16} /> },
    { title: "Question Formatter Pro", desc: "Clean markdown string errors into sanitized layouts.", icon: <CheckSquare className="text-emerald-500" size={16} /> }
  ];

  return (
    <div className="flex-1 bg-white border border-neutral-200 rounded-[24px] p-6 space-y-6 overflow-y-auto font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => router.push("/create")}
          className="sm:col-span-2 border-2 border-dashed border-neutral-200 hover:border-neutral-300 bg-neutral-50/20 hover:bg-neutral-50/50 p-6 rounded-2xl flex items-center justify-between gap-6 cursor-pointer transition-all group"
        >
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-neutral-900">Flagship Core Assignment Generator</h3>
            <p className="text-xs text-neutral-500">Launch standard multi-modal dynamic paper pipeline processing workflows layout charts.</p>
          </div>
          <div className="bg-neutral-900 text-white p-3 rounded-xl shadow-md group-hover:scale-105 transition-transform">
            <Wand2 size={16} />
          </div>
        </div>

        {actions.map((act, idx) => (
          <div key={idx} className="border border-neutral-200 bg-white rounded-2xl p-4 space-y-2 hover:border-neutral-300 transition-all shadow-sm">
            <div className="flex items-center gap-2">
              {act.icon}
              <h4 className="text-xs font-bold text-neutral-800">{act.title}</h4>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">{act.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}