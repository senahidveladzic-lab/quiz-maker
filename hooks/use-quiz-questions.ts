"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Question, QuizQuestion, QuizFormData } from "@/lib/types";

interface UseQuizQuestionsParams {
  form: UseFormReturn<QuizFormData>;
  allQuestions: Question[];
}

interface UseQuizQuestionsReturn {
  questions: QuizQuestion[];
  totalQuestions: number;
  availableQuestions: Question[];
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

export function useQuizQuestions({
  form,
  allQuestions,
}: UseQuizQuestionsParams): UseQuizQuestionsReturn {
  const [deleteQuestionDialog, setDeleteQuestionDialog] = useState<{
    open: boolean;
    questionToDelete: QuizQuestion | null;
  }>({
    open: false,
    questionToDelete: null,
  });

  const questions = form.watch("questions");
  const totalQuestions = questions.length;

  const availableQuestions = allQuestions.filter(
    (q) => !questions.some((qq) => qq.id === q.id),
  );

  const addNewQuestion = (): void => {
    const current = form.getValues("questions");
    const newQuestion: QuizQuestion = {
      text: "",
      answer: "",
      isCollapsed: false,
      tempId: `new-${Date.now()}-${Math.random()}`,
    };
    form.setValue("questions", [newQuestion, ...current]);
  };

  const removeQuestion = (tempId: string): void => {
    const current = form.getValues("questions");
    const questionToDelete = current.find((q) => q.tempId === tempId);

    if (questionToDelete) {
      setDeleteQuestionDialog({
        open: true,
        questionToDelete,
      });
    }
  };

  const confirmRemoveQuestion = (): void => {
    if (!deleteQuestionDialog.questionToDelete) return;

    const current = form.getValues("questions");
    form.setValue(
      "questions",
      current.filter(
        (q) => q.tempId !== deleteQuestionDialog.questionToDelete?.tempId,
      ),
    );

    setDeleteQuestionDialog({
      open: false,
      questionToDelete: null,
    });
  };

  const addRecycledQuestion = (question: Question): void => {
    const current = form.getValues("questions");
    const newTempId = `recycled-${question.id}`;

    if (current.some((q) => q.tempId === newTempId)) {
      toast.error("Question already added to this quiz!");
      return;
    }

    const recycledQuestion: QuizQuestion = {
      id: question.id,
      text: question.text,
      answer: question.answer,
      isCollapsed: true,
      tempId: newTempId,
    };

    form.setValue("questions", [recycledQuestion, ...current]);
    toast.success("Question added successfully!");
  };

  const toggleCollapse = (tempId: string): void => {
    const current = form.getValues("questions");
    const updated = current.map((q) =>
      q.tempId === tempId ? { ...q, isCollapsed: !q.isCollapsed } : q,
    );
    form.setValue("questions", updated);
  };

  const reorderQuestions = (newOrder: QuizQuestion[]): void => {
    form.setValue("questions", newOrder);
  };

  return {
    questions,
    totalQuestions,
    availableQuestions,
    addNewQuestion,
    removeQuestion,
    confirmRemoveQuestion,
    addRecycledQuestion,
    toggleCollapse,
    reorderQuestions,
    deleteQuestionDialog,
    setDeleteQuestionDialog,
  };
}
