import { UseFormReturn } from "react-hook-form";

export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface Quiz {
  id: string;
  name: string;
  questions: Question[];
}

export interface QuizCreateDto {
  name: string;
  questions: Question[];
}

export interface QuizQuestion {
  id?: string;
  text: string;
  answer: string;
  isCollapsed: boolean;
  tempId: string;
}

// ============================================
// Form Data Structure
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
  fields: QuizQuestion[];
  totalQuestions: number;
  isSubmitting: boolean;
  onSubmit: (data: QuizFormData) => Promise<void>;
  addNewQuestion: () => void;
  removeQuestion: (tempId: string) => void;
  confirmRemoveQuestion: () => void;
  addRecycledQuestion: (question: Question) => void;
  toggleCollapse: (tempId: string) => void;
  reorderQuestions: (newOrder: QuizQuestion[]) => void;
  deleteQuestionDialog: {
    open: boolean;
    questionToDelete: QuizQuestion | null;
  };
  setDeleteQuestionDialog: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      questionToDelete: QuizQuestion | null;
    }>
  >;
  lastAddedTempId: string | null;
}
