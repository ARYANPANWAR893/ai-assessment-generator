"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileSpreadsheet, Sparkles, FolderHeart, Plus } from "lucide-react";

export function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [assignmentCount, setAssignmentCount] = useState<number>(0);

  // ✅ Automatically pulls active count metrics from your database array
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/assignments-list")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setAssignmentCount(data.length))
      .catch(() => setAssignmentCount(0));
  }, [pathname]);

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { 
      id: "assignments", 
      label: "Assignments", 
      icon: FileSpreadsheet, 
      path: "/assignments", 
      // ✅ Dynamically reflects true available assignments count instead of 10
      count: assignmentCount > 0 ? assignmentCount : null 
    },
    { id: "toolkit", label: "AI Teacher's Toolkit", icon: Sparkles, path: "/toolkit" },
    { id: "library", label: "Library", icon: FolderHeart, path: "/library" }
  ];

  return (
    // 🛠️ FIX: Changed h-full to h-screen and removed margins to expand the column vertically to fill the page 
    <aside className="w-[280px] h-screen bg-white border-r border-neutral-200 flex flex-col justify-between p-6 shrink-0 hidden lg:flex font-sans">
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-2 cursor-pointer" onClick={() => router.push("/create")}>
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-black text-xl italic tracking-tighter">V</span>
          </div>
          <span className="text-xl font-bold text-neutral-900 tracking-tight">VedaAI</span>
        </div>

        <button
          onClick={() => router.push("/create")}
          className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium border-2 border-orange-300 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Create Assignment</span>
        </button>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`w-full h-10 px-3 rounded-xl flex items-center justify-between text-sm transition-all group ${
                  isActive ? "bg-neutral-50 text-neutral-900" : "hover:bg-neutral-50/50 text-neutral-500"
                }`}
              >
                <div className="flex items-center gap-3 group-hover:text-neutral-900">
                  <Icon size={18} strokeWidth={2} className={isActive ? "text-neutral-900" : "text-neutral-400"} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count && (
                  <span className="h-5 px-2 bg-orange-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}