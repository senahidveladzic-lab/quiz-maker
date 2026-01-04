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

export interface QuestionCreateDto {
  text: string;
  answer: string;
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

// ============================================
// Quiz Question Type
// ============================================

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
  questions: QuizQuestion[];
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
}

// ============================================
// Extended Edit Hook Return Type
// ============================================

export interface UseEditQuizFormReturn extends UseQuizFormReturn {
  isLoadingQuiz: boolean;
  quizNotFound: boolean;
}
