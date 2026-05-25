"use client";

// Swap out context hook for Zustand hook
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { Plus, ClipboardX } from "lucide-react";

export function ZeroStateDisplay() {
  const setCurrentView = useAssignmentStore((state) => state.setCurrentView);

  return (
    <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
      {/* ... Keep the exact same visual nodes inside return ... */}
      <div className="max-w-md flex flex-col items-center">
        <div className="w-48 h-48 bg-neutral-50 rounded-full flex items-center justify-center relative mb-6 border border-neutral-100">
          <div className="absolute inset-0 border-2 border-dashed border-neutral-200 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="w-24 h-32 bg-white border border-neutral-200 rounded-xl shadow-sm relative flex flex-col p-3 gap-2">
            <div className="h-2 w-12 bg-neutral-300 rounded" />
            <div className="h-1.5 w-16 bg-neutral-200 rounded" />
            <div className="h-1.5 w-14 bg-neutral-200 rounded" />
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 absolute -bottom-2 -right-2 flex items-center justify-center shadow-md">
              <ClipboardX size={20} className="text-red-500" />
            </div>
          </div>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-2">No assignments yet</h3>
        <p className="text-xs text-neutral-400 leading-relaxed mb-6 px-4">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <button
          onClick={() => setCurrentView("create-form")}
          className="h-11 px-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full flex items-center justify-center gap-2 text-sm font-medium shadow-md transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Create Your First Assignment</span>
        </button>
      </div>
    </div>
  );
}