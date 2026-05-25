"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FileText, Calendar, Layers, Award, ArrowUpRight, Search } from "lucide-react";

export default function AssignmentsArchiveView() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/assignments-list")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter conditions mapping layout execution box
  const filteredItems = items.filter(item => {
    // 1. Text filter lookup
    const matchesSearch = (item.additionalInfo || "").toLowerCase().includes(search.toLowerCase());
    
    // 2. Fallback parameter extraction values
    const currentUserName = user?.name || "Aryan panwar";
    const currentUserEmail = user?.email || "";

    // 3. Conditional matching evaluation matrices
    const matchesName = item.createdBy === currentUserName || 
                        item.creator === currentUserName ||
                        item.userId === user?.email || item.userId === user?.name

    const matchesEmail = currentUserEmail ? (item.creatorEmail === currentUserEmail || item.email === currentUserEmail) : false;

    // Default true if no session properties available, otherwise strict verification check
    const isOwner = matchesEmail || matchesName;

    // 🕵️‍♂️ DEV LOG: Open your browser console (F12) to see this output live!
    console.log("Assignment Filtering Payload:", {
      title: item.additionalInfo,
      userIdKey: item.userId,
      createdByKey: item.createdBy,
      evaluatedMatchStatus: isOwner
    });

    return matchesSearch && isOwner;
  });

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center py-12">
        <div className="h-5 w-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6 font-sans">
      
      {/* Top Interactive Filter Utility Bar */}
      <div className="relative w-full max-w-md shrink-0">
        <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search through your compiled blueprints..."
          className="w-full h-9 pl-9 pr-4 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neutral-900 transition-colors bg-white shadow-sm"
        />
      </div>

      {/* Grid Canvas Scrolling Viewport Context Box */}
      <div className="flex-1 pb-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-200 rounded-2xl bg-white">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">No Active Assignment Items</p>
            <p className="text-[11px] text-neutral-400 mt-1">Assignments assigned under your workspace appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const questionsCount = item.config?.numberOfQuestions || 0;
              const totalMarks = item.config?.marks || 0;
              const infoLabel = item.additionalInfo || "General Syllabus Evaluation Blueprint";

              return (
                <div 
                  key={item._id} 
                  className="border border-neutral-200 hover:border-neutral-300 rounded-2xl p-4 bg-white transition-all flex flex-col justify-between gap-4 group shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="bg-orange-50 text-orange-600 p-2 rounded-xl border border-orange-100 shrink-0">
                        <FileText size={16} />
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        item.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-neutral-800 line-clamp-1 group-hover:text-neutral-900">
                      {infoLabel}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-b border-neutral-100/70 py-2 text-[10px] text-neutral-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Layers size={12} className="text-neutral-400" />
                      <span>{questionsCount} Items</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={12} className="text-neutral-400" />
                      <span>{totalMarks} Marks</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <Calendar size={12} className="text-neutral-400" />
                      <span>{item.config?.dueDate || "Inline"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push(`/assessment/${item._id}`)}
                    className="w-full h-8 bg-white hover:bg-neutral-900 border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-white rounded-xl text-[11px] font-bold inline-flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Open Blueprint Sheet</span>
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}