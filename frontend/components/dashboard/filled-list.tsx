"use client";

import { useAssignmentStore } from "@/store/useAssignmentStore";
import { Search, Filter, MoreVertical, FileText, Trash2, Plus } from "lucide-react";
import { useState } from "react";

export function ActiveCollectionList() {
  const setCurrentView = useAssignmentStore((state) => state.setCurrentView);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const mockAssignments = Array.from({ length: 6 }, (_, i) => ({
    id: `item-${i}`,
    title: "Quiz on Electricity",
    assigned: "20-06-2025",
    due: "21-06-2025"
  }));

  return (
    <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col overflow-hidden">
      {/* ... Your exact list HTML UI blocks here — completely unmodified ... */}
      <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-3 items-center bg-white shrink-0">
        <div className="h-10 px-3 border border-neutral-200 rounded-xl bg-neutral-50/50 flex items-center gap-2 w-full sm:w-48 text-neutral-400 cursor-pointer">
          <Filter size={14} />
          <span className="text-xs font-semibold text-neutral-600">Filter By</span>
        </div>
        <div className="relative flex items-center flex-1 w-full">
          <input
            type="text"
            placeholder="Search Assignment"
            className="w-full h-10 pl-10 pr-4 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-neutral-900 bg-neutral-50/20"
          />
          <Search size={15} className="text-neutral-400 absolute left-3.5 pointer-events-none" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-neutral-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {mockAssignments.map((data) => (
            <div key={data.id} className="bg-white border border-neutral-200 rounded-2xl p-5 relative shadow-sm hover:border-neutral-300 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-bold text-neutral-900 tracking-tight cursor-pointer hover:text-blue-600" onClick={() => setCurrentView("output-preview")}>
                  {data.title}
                </h4>
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === data.id ? null : data.id)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 rounded-lg transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {activeMenuId === data.id && (
                    <div className="absolute right-0 top-7 w-36 bg-white border border-neutral-200 rounded-xl shadow-lg p-1.5 z-30 space-y-0.5">
                      <button 
                        onClick={() => setCurrentView("output-preview")}
                        className="w-full h-8 px-2 rounded-lg flex items-center gap-2 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        <FileText size={13} className="text-neutral-400" />
                        <span>View Assignment</span>
                      </button>
                      <button className="w-full h-8 px-2 rounded-lg flex items-center gap-2 text-left text-xs font-medium text-red-600 hover:bg-red-50">
                        <Trash2 size={13} className="text-red-400" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 border-t border-neutral-100 pt-3">
                <div>Assigned on : <span className="text-neutral-700 font-bold">{data.assigned}</span></div>
                <div>Due : <span className="text-neutral-700 font-bold">{data.due}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-20 right-6 z-40 block lg:hidden">
        <button 
          onClick={() => setCurrentView("create-form")}
          className="w-12 h-12 rounded-full bg-neutral-300 text-white flex items-center justify-center shadow-xl active:scale-95"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}