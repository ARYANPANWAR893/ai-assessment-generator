"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, CheckCircle2, CircleDot } from "lucide-react";

interface PageProps {
  params: Promise<{ assignmentId: string }>;
}

export default function AssignmentGenerationLoadingScreen({ params }: PageProps) {
  const router = useRouter();
  
  // Unwrap parameters using Next 15/16 native use() async rules matching your folder name exactly
  const { assignmentId } = use(params);
  
  const [currentStage, setCurrentStage] = useState<"queued" | "generating" | "structuring" | "completed" | "failed">("queued");
  const [progressPercent, setProgressPercent] = useState(15);

  useEffect(() => {
    if (!assignmentId) return;

    // Connect directly to backend protocol socket binding using explicit IPv4 loopback
    const socket = new WebSocket(`ws://127.0.0.1:8080?assignmentId=${assignmentId}`);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.status) {
        setCurrentStage(message.status);
        setProgressPercent(message.progress);
      }

      if (message.status === "completed") {
        socket.close();
        // ✅ FIXED: Routes to your exact workspace folder folder ('/assessment')
        router.push(`/assessment/${assignmentId}`);
      }
    };

    // Lightweight HTTP Polling Fallback to handle routing safely if WebSockets disconnect
    const safetyPollingInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8080/api/assignments/${assignmentId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "completed") {
            clearInterval(safetyPollingInterval);
            socket.close();
            // ✅ FIXED: Routes to your exact workspace folder folder ('/assessment')
            router.push(`/assessment/${assignmentId}`);
          } else if (data.status === "failed") {
            setCurrentStage("failed");
            clearInterval(safetyPollingInterval);
          }
        }
      } catch (err) {
        console.warn("Safety polling interceptor failed silently:", err);
      }
    }, 2500);

    return () => {
      socket.close();
      clearInterval(safetyPollingInterval);
    };
  }, [assignmentId, router]);

  const renderStageIcon = (stageName: typeof currentStage) => {
    if (currentStage === "completed") return <CheckCircle2 className="text-green-500 animate-bounce" size={24} />;
    if (currentStage === stageName) return <Loader2 className="text-orange-500 animate-spin" size={24} />;
    return <CircleDot className="text-neutral-200" size={24} />;
  };

  return (
    <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-md w-full space-y-8 text-center">
        
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Assembling Assessment Paper</h2>
          <p className="text-xs text-neutral-400">Our background pipelines are actively parsing your criteria specifications.</p>
        </div>

        {/* Progress bar line element */}
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Milestone Tracker Card */}
        <div className="bg-neutral-50/50 border border-neutral-100 rounded-2xl p-4 text-left space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={currentStage !== "queued" ? "text-neutral-400" : "text-neutral-900"}>✓ Assignment Created</span>
            <CheckCircle2 className="text-green-500" size={16} />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={currentStage === "generating" ? "text-neutral-900" : "text-neutral-400"}>⏳ Generating Questions</span>
            {renderStageIcon("generating")}
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={currentStage === "structuring" ? "text-neutral-900" : "text-neutral-400"}>... Structuring Assessment Matrix</span>
            {renderStageIcon("structuring")}
          </div>
        </div>

        {currentStage === "failed" && (
          <p className="text-xs font-bold text-red-500 bg-red-50 p-3 border border-red-100 rounded-xl">
            Pipeline Generation Error: Configuration criteria rejected.
          </p>
        )}
      </div>
    </div>
  );
}