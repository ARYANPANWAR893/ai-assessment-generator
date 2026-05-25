"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export function LoadingStateDisplay({ assignmentId }: { assignmentId: string }) {
    const router = useRouter();
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        // If Next.js parameters are loading or string values resolve directly to "undefined", halt processing instantly
        if (!assignmentId || assignmentId === "undefined") {
            console.warn("Safety Check Active: Postponing API network fetches while assignmentId is undefined.");
            return;
        }

        const ws = new WebSocket(`ws://ai-assessment-generator.onrender.com?assignmentId=${assignmentId}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setProgress(data.progress || 0);
            if (data.status === "completed") {
                ws.close();
                router.push(`/assessment/${assignmentId}`);
            }
        };

        const safetyPoll = setInterval(async () => {
            try {
                const res = await fetch(`https://ai-assessment-generator.onrender.com/api/assignments/${assignmentId}`);
                if (!res.ok) return; // Prevent parsing errors on un-synced collection nodes

                const data = await res.json();
                if (data.progress > progress) setProgress(data.progress);
                if (data.status === "completed") {
                    clearInterval(safetyPoll);
                    ws.close();
                    router.push(`/assessment/${assignmentId}`);
                }
            } catch (e) {
                console.error("Poller network path exception dropped safely:", e);
            }
        }, 2000);

        return () => {
            ws.close();
            clearInterval(safetyPoll);
        };
    }, [assignmentId, router, progress]);

    return (
        <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
            <div className="max-w-md w-full flex flex-col items-center font-sans">
                <div className="w-24 h-24 bg-neutral-50 rounded-2xl flex items-center justify-center relative mb-8 border border-neutral-100">
                    <div className="absolute inset-0 border-2 border-blue-600 rounded-2xl animate-ping opacity-20" />
                    <Sparkles size={32} className="text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">AI Synthesis Active</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-6">Real-time status synced via production workers socket grids.</p>
                <div className="w-full max-w-xs space-y-2">
                    <div className="w-full h-2 bg-neutral-100 border rounded-full overflow-hidden">
                        <div className="h-full bg-neutral-950 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-neutral-400 tracking-widest">
                        <span>SOCKETS MODE</span>
                        <span>{progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}