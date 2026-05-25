"use client";

import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useRouter } from "next/navigation";
import { UploadCloud, Calendar, ArrowLeft, ArrowRight, FileCheck, X, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function AssignmentCreatorForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    dueDate, 
    setDueDate, 
    additionalInfo, 
    setAdditionalInfo, 
    questionRows,
    addQuestionRow,
    removeQuestionRow,
    updateQuestionRow
  } = useAssignmentStore();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalQuestions = questionRows.reduce((acc, row) => acc + row.count, 0);
  const totalMarks = questionRows.reduce((acc, row) => acc + (row.count * row.marks), 0);

  // Handle local memory cleanup for generated blob URLs to avoid storage leaks
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      if (file.type.startsWith("image/")) {
        // Create an in-memory data URL for the selected image asset
        setFilePreviewUrl(URL.createObjectURL(file));
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const handleGenerationSubmit = async () => {
    if (!dueDate.trim()) {
      setValidationError("Strict Operational Constraint: Target assignment due date must be defined.");
      return;
    }
    if (questionRows.length === 0 || totalQuestions === 0) {
      setValidationError("Strict Operational Constraint: Point distribution matrix requires at least 1 active row definition.");
      return;
    }
    setValidationError(null);

    try {
      const formData = new FormData();
      formData.append("dueDate", dueDate);
      formData.append("additionalInfo", additionalInfo);
      formData.append("questionRows", JSON.stringify(questionRows));
      
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch("http://localhost:8080/api/assignments", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Server returned error status code: ${res.status}`);
      }

      const data = await res.json();
      if (data && data.assignmentId) {
        // Clear local file states before pushing page routing changes
        setSelectedFile(null);
        setFilePreviewUrl(null);
        router.push(`/generating/${data.assignmentId}`);
      }
    } catch (err) {
      console.error("Critical submission flow exception:", err);
      setValidationError("Network Failure: Could not communicate with generation worker pipelines.");
    }
  };

  return (
    <div className="flex-1 w-full bg-white border border-neutral-200 rounded-[24px] shadow-sm flex flex-col overflow-hidden font-sans">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl mx-auto w-full">
        
        <div>
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">Assignment Details</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Basic configurations defining structural requirements.</p>
        </div>

        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl leading-normal">
            {validationError}
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept=".png,.jpg,.jpeg,.pdf"
        />

        {/* Dropzone Component with Live Thumbnail Preview */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer group min-h-[160px] ${
            selectedFile ? 'border-blue-500 bg-blue-50/10' : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
          }`}
        >
          {filePreviewUrl ? (
            <div className="relative w-20 h-20 border border-neutral-200 rounded-lg overflow-hidden shadow-sm mb-2">
              <img 
                src={filePreviewUrl} 
                alt="Material preview" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-white border border-neutral-100 rounded-xl flex items-center justify-center shadow-sm mb-3">
              {selectedFile ? (
                <FileCheck size={20} className="text-blue-600" />
              ) : (
                <UploadCloud size={20} className="text-neutral-400 group-hover:text-neutral-900" />
              )}
            </div>
          )}
          <span className="text-xs font-semibold text-neutral-800 truncate max-w-xs">
            {selectedFile ? `Selected: ${selectedFile.name}` : "Choose a file or drag & drop it here"}
          </span>
          <span className="text-[10px] text-neutral-400 mt-1">
            {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "JPEG, PNG, PDF up to 10MB limits"}
          </span>
        </div>

        {/* Native Calendar Picker Overlay Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800">Due Date</label>
          <div className="relative flex items-center">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-10 pl-3 pr-10 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all cursor-pointer"
            />
            <Calendar size={16} className="text-neutral-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Allocation Matrix Parameter Grid */}
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-1">
            <div className="col-span-6">Question Type</div>
            <div className="col-span-3 text-center">No. of Questions</div>
            <div className="col-span-3 text-center">Marks Per Unit</div>
          </div>

          <div className="space-y-2.5">
            {questionRows.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-6">
                  <select
                    value={row.type}
                    onChange={(e) => updateQuestionRow(row.id, { type: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 outline-none focus:border-neutral-900 bg-white"
                  >
                    <option>Multiple Choice Questions</option>
                    <option>Short Questions</option>
                    <option>Diagram/Graph-Based Questions</option>
                    <option>Numerical Problems</option>
                  </select>
                </div>

                <div className="col-span-3 flex justify-center">
                  <div className="h-10 border border-neutral-200 rounded-lg inline-flex items-center bg-white overflow-hidden p-1 gap-2">
                    <button 
                      type="button"
                      onClick={() => updateQuestionRow(row.id, { count: Math.max(1, row.count - 1) })}
                      className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-900 font-bold hover:bg-neutral-50 rounded"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-neutral-800 min-w-[20px] text-center">{row.count}</span>
                    <button 
                      type="button"
                      onClick={() => updateQuestionRow(row.id, { count: row.count + 1 })}
                      className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-900 font-bold hover:bg-neutral-50 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-span-3 flex justify-center relative items-center gap-2">
                  <div className="h-10 border border-neutral-200 rounded-lg inline-flex items-center bg-white overflow-hidden p-1 gap-2">
                    <button 
                      type="button"
                      onClick={() => updateQuestionRow(row.id, { marks: Math.max(1, row.marks - 1) })}
                      className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-900 font-bold hover:bg-neutral-50 rounded"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-neutral-800 min-w-[20px] text-center">{row.marks}</span>
                    <button 
                      type="button"
                      onClick={() => updateQuestionRow(row.id, { marks: row.marks + 1 })}
                      className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-900 font-bold hover:bg-neutral-50 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeQuestionRow(row.id)}
                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addQuestionRow}
            className="h-9 px-3 border border-neutral-200 rounded-lg inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 shadow-sm mt-2"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Question Type</span>
          </button>
        </div>

        {/* Additional Custom Instructions Prompt area */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-neutral-800">Additional Instructions (For better output)</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="e.g. Generate a question paper for a 3 hour exam duration..."
            className="w-full h-20 p-3 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 placeholder-neutral-300 outline-none focus:border-neutral-900 resize-none leading-normal"
          />
        </div>

        <div className="pt-4 border-t border-neutral-100 flex flex-col items-end gap-1 text-xs font-bold text-neutral-500">
          <div>Total Questions : <span className="text-neutral-900">{totalQuestions}</span></div>
          <div>Total Marks : <span className="text-neutral-900">{totalMarks}</span></div>
        </div>
      </div>

      {/* Synchronized Component Layout Footer Panel */}
      <footer className="p-4 bg-neutral-50 border-t border-neutral-200 shrink-0 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="h-10 px-4 bg-white border border-neutral-200 rounded-xl inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 shadow-sm hover:bg-neutral-50"
        >
          <ArrowLeft size={14} />
          <span>Previous</span>
        </button>
        <button
          type="button"
          onClick={handleGenerationSubmit}
          className="h-10 px-5 bg-neutral-300 hover:bg-neutral-800 text-white rounded-xl inline-flex items-center gap-2 text-xs font-semibold shadow-md active:scale-95 transition-all"
        >
          <span>Generate Paper</span>
          <ArrowRight size={14} />
        </button>
      </footer>
    </div>
  );
}