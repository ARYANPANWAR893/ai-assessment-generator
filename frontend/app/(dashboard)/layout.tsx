"use client";

import React from "react";
import DashboardGlobalHeader from "@/components/dashboard/header";
import { SidebarNav } from "@/components/dashboard/sidebar-nav"; 

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 🛠️ FIX: Hardens layout to a locked full-screen viewport boundary box
    <div className="h-screen w-full bg-neutral-50 flex overflow-hidden fixed inset-0 font-sans">
      
      {/* 1. Left Operational Navigation Bar Sidebar */}
      <SidebarNav />

      {/* 2. Main Center-Right Panel Workspace Panel Container */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-neutral-50 relative">
        
        {/* Dynamic Global Navbar Header */}
        <DashboardGlobalHeader />

        {/* 3. ✅ FIXED SCROLL CONTAINER ZONE: 
            Isolates the sub-page contents, providing an explicit height grid 
            so your pages know exactly where to calculate content scroll logic. */}
        <main className="flex-1 p-6 overflow-y-auto min-w-0 w-full relative">
          {children}
        </main>
        
      </div>
    </div>
  );
}