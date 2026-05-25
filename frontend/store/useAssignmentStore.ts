import { create } from "zustand";

export type ActiveView = "zero-state" | "create-form" | "loading" | "output-preview";

export interface QuestionRow {
  id: string;
  type: string;
  count: number;
  marks: number;
}

export interface GeneratedQuestion {
  id: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  text: string;
  marks: number;
}

export interface AssignmentPayload {
  institution: string;
  location: string;
  subject: string;
  classLevel: string;
  dueDate: string;
  totalQuestions: number;
  totalMarks: number;
  questions: GeneratedQuestion[];
}

interface AssignmentState {
  // Navigation & View Flow Control
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  
  // Creation Form State fields
  dueDate: string;
  setDueDate: (date: string) => void;
  additionalInfo: string;
  setAdditionalInfo: (info: string) => void;
  questionRows: QuestionRow[];
  
  // Matrix Form Action Mutations
  addQuestionRow: () => void;
  removeQuestionRow: (id: string) => void;
  updateQuestionRow: (id: string, fields: Partial<QuestionRow>) => void;
  
  // Background Workers Progress Matrix
  generationProgress: number;
  setGenerationProgress: (progress: number) => void;
  
  // Engine Output State
  generatedPaper: AssignmentPayload | null;
  triggerMockGeneration: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  currentView: "zero-state",
  setCurrentView: (view) => set({ currentView: view }),
  
  dueDate: "",
  setDueDate: (date) => set({ dueDate: date }),
  additionalInfo: "",
  setAdditionalInfo: (info) => set({ additionalInfo: info }),
  
  questionRows: [
    { id: "1", type: "Multiple Choice Questions", count: 4, marks: 1 },
    { id: "2", type: "Short Questions", count: 3, marks: 2 },
    { id: "3", type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
    { id: "4", type: "Numerical Problems", count: 5, marks: 5 }
  ],

  addQuestionRow: () => set((state) => ({
    questionRows: [
      ...state.questionRows,
      { id: crypto.randomUUID(), type: "Short Questions", count: 1, marks: 1 }
    ]
  })),

  removeQuestionRow: (id) => set((state) => ({
    questionRows: state.questionRows.filter(row => row.id !== id)
  })),

  updateQuestionRow: (id, fields) => set((state) => ({
    questionRows: state.questionRows.map(row => row.id === id ? { ...row, ...fields } : row)
  })),

  generationProgress: 0,
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  
  generatedPaper: null,

  triggerMockGeneration: () => {
    const { questionRows, dueDate } = get();
    set({ currentView: "loading", generationProgress: 0 });

    // 1. Simulating Progress Loop (Simulating Redis/BullMQ task intervals)
    const progressInterval = setInterval(() => {
      const currentProgress = get().generationProgress;
      if (currentProgress < 100) {
        set({ generationProgress: currentProgress + 10 });
      } else {
        clearInterval(progressInterval);
        
        // 2. Generate Structured Mock Questions based on current form metrics
        const mockQuestions: GeneratedQuestion[] = [];
        let indexId = 1;
        
        questionRows.forEach(row => {
          for (let i = 0; i < row.count; i++) {
            const difficulties: Array<"Easy" | "Moderate" | "Challenging"> = ["Easy", "Moderate", "Challenging"];
            const selectedDiff = difficulties[i % difficulties.length];
            
            mockQuestions.push({
              id: `q-${indexId++}`,
              difficulty: selectedDiff,
              text: `Explain code compliance metrics regarding alternative vector states for ${row.type.toLowerCase()} under section ${indexId}.`,
              marks: row.marks
            });
          }
        });

        const totalQuestionsCount = questionRows.reduce((acc, row) => acc + row.count, 0);
        const totalMarksSum = questionRows.reduce((acc, row) => acc + (row.count * row.marks), 0);

        // 3. Hydrate state values and transition views smoothly
        set({
          generatedPaper: {
            institution: "Delhi Public School, Sector-4, Bokaro",
            location: "Bokaro Steel City",
            subject: "Computer Science & Structural Engineering",
            classLevel: "Grade 8 / Class 5th",
            dueDate: dueDate || "21-06-2025",
            totalQuestions: totalQuestionsCount,
            totalMarks: totalMarksSum,
            questions: mockQuestions
          },
          currentView: "output-preview"
        });
      }
    }, 350); // Completes mock pipeline processing in 3.5 seconds
  }
}));