"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bell, LogOut, Settings, ShieldCheck } from "lucide-react";

export default function DashboardGlobalHeader() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // 🛠️ Dynamic Navigation Title Evaluator
  const getHeaderTitle = () => {
    if (pathname.includes("/create")) return "Create Assessment Template";
    if (pathname.includes("/assessment")) return "Evaluation Sheet View";
    if (pathname.includes("/generating")) return "Pipeline Worker Engine";
    if (pathname.includes("/toolkit")) return "Instructor's AI Toolkit";
    if (pathname.includes("/library")) return "Assessment Library Archive";
    if (pathname.includes("/assignments")) return "My Assignments Directory";
    return "Dashboard Workspace Management";
  };

  const dummyNotifications = [
    "🎉 Assessment Blueprint compiled perfectly via Groq.",
    "💾 Document instance written cleanly to cluster database.",
    "🚀 Connected safely to background BullMQ loop framework."
  ];

  // Safe string check for user name initials fallback matrix
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "I";
  const displayEmail = user?.email || "instructor@university.edu";
  const displayName = user?.name || "Instructor Account";

  return (
    <header className="h-16 w-full border-b border-neutral-200 px-6 flex items-center justify-between bg-white relative font-sans shrink-0 z-30">
      
      {/* Active Header Dynamic Title */}
      <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
        {getHeaderTitle()}
      </h2>

      {/* Control Actions Panel */}
      <div className="flex items-center gap-3 relative">
        
        {/* Notification Bell Dropdown Panel */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => { 
              setShowNotifications(!showNotifications); 
              setShowProfileMenu(false); 
            }}
            className="p-2 border border-neutral-200 hover:border-neutral-300 text-neutral-600 hover:text-neutral-900 rounded-xl transition-all shadow-sm relative focus:outline-none"
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-orange-500 rounded-full" />
          </button>

          {showNotifications && (
            <>
              {/* Overlay Backdrop to dismiss panel cleanly on click away */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-2xl shadow-lg p-2 space-y-1 text-[11px] font-medium text-neutral-600 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-1.5 border-b border-neutral-100 font-bold text-neutral-900 uppercase tracking-wider text-[9px]">Live Alerts</div>
                {dummyNotifications.map((notif, idx) => (
                  <div key={idx} className="p-2 hover:bg-neutral-50 rounded-xl cursor-default leading-normal border border-transparent">
                    {notif}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User Profile Dynamic Menu Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { 
              setShowProfileMenu(!showProfileMenu); 
              setShowNotifications(false); 
            }}
            className="h-9 px-3 border border-neutral-200 hover:border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 flex items-center gap-2 bg-white transition-all shadow-sm focus:outline-none"
          >
            <div className="h-4 w-4 bg-neutral-900 text-white rounded-md flex items-center justify-center text-[10px]">
              {userInitial}
            </div>
            <span className="max-w-[80px] truncate">{displayName}</span>
          </button>

          {showProfileMenu && (
            <>
              {/* Overlay Backdrop to dismiss panel cleanly on click away */}
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-2xl shadow-lg p-1 space-y-0.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-neutral-100 text-left">
                  <p className="text-xs font-bold text-neutral-900 truncate">{displayName}</p>
                  <p className="text-[10px] text-neutral-400 font-medium truncate">{displayEmail}</p>
                </div>
                <div className="p-1 space-y-0.5">
                  <button 
                    type="button" 
                    onClick={() => { router.push("/"); setShowProfileMenu(false); }}
                    className="w-full h-8 px-2 text-left text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Settings size={13} />
                    <span>Workspace Home</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => { router.push("/toolkit"); setShowProfileMenu(false); }}
                    className="w-full h-8 px-2 text-left text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <ShieldCheck size={13} />
                    <span>AI Integration</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full h-8 px-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors border-t border-neutral-100 pt-1 mt-1"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}