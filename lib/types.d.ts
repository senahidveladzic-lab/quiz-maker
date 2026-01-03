import { UseFormReturn } from "react-hook-form";
export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface Quiz {
  id: string;
  name: string;
  questionIds: string[];
  createdAt: string;
}

export interface QuizCreateDto {
  name: string;
  questionIds: string[];
}

export interface QuestionCreateDto {
  text: string;
  answer: string;
}

// ============================================
// Quiz Question Type (for form state)
// ============================================

export interface QuizQuestion {
  id?: string;
  text: string;
  answer: string;
  type: "existing" | "new" | "recycled";
  isCollapsed: boolean;
  tempId: string;
  originalText?: string;
  originalAnswer?: string;
  willUpdateGlobally?: boolean;
}

// ============================================
// Form Data Structure (shared by create & edit)
// ============================================

export interface QuizFormData {
  name: string;
  questions: QuizQuestion[];
}

// ============================================
// Base Hook Return Type
// ============================================

export interface UseQuizFormReturn {
  form: UseFormReturn<QuizFormData>;
  availableQuestions: Question[];
  isLoadingQuestions: boolean;
  questions: QuizQuestion[];
  totalQuestions: number;
  isSubmitting: boolean;
  onSubmit: (data: QuizFormData) => Promise<void>;
  addNewQuestion: () => void;
  removeQuestion: (tempId: string) => void;
  addRecycledQuestion: (question: Question) => void;
  toggleCollapse: (tempId: string) => void;
  reorderQuestions: (newOrder: QuizQuestion[]) => void;
  checkQuestionModified?: (tempId: string) => void;
}

// ============================================
// Edit Dialog Props
// ============================================

export interface EditDialogProps {
  editStrategyDialog: {
    open: boolean;
    questionTempId: string | null;
    questionText: string;
  };
  setEditStrategyDialog: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      questionTempId: string | null;
      questionText: string;
    }>
  >;
  handleUpdateGlobally: () => void;
  handleCreateNewVersion: () => void;
}

// ============================================
// Extended Edit Hook Return Type
// ============================================

export interface UseEditQuizFormReturn extends UseQuizFormReturn {
  isLoadingQuiz: boolean;
  quizNotFound: boolean;
  checkQuestionModified: (tempId: string) => void;
  editStrategyDialog: EditDialogProps["editStrategyDialog"];
  setEditStrategyDialog: EditDialogProps["setEditStrategyDialog"];
  handleUpdateGlobally: EditDialogProps["handleUpdateGlobally"];
  handleCreateNewVersion: EditDialogProps["handleCreateNewVersion"];
}
