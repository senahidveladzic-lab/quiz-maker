"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Question, QuizQuestion, QuizFormData } from "@/lib/types";

interface UseQuizQuestionsParams {
  form: UseFormReturn<QuizFormData>;
  allQuestions: Question[];
}

interface UseQuizQuestionsReturn {
  fields: QuizQuestion[];
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
  lastAddedTempId: string | null;
}

export function useQuizQuestions({
  form,
  allQuestions,
}: UseQuizQuestionsParams): UseQuizQuestionsReturn {
  const { fields, append, remove, update, replace } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const [deleteQuestionDialog, setDeleteQuestionDialog] = useState<{
    open: boolean;
    questionToDelete: QuizQuestion | null;
  }>({
    open: false,
    questionToDelete: null,
  });

  const [lastAddedTempId, setLastAddedTempId] = useState<string | null>(null);

  const totalQuestions = fields.length;

  const availableQuestions = allQuestions.filter(
    (q) => !fields.some((field) => field.id === q.id),
  );

  const addNewQuestion = (): void => {
    const tempId = `new-${Date.now()}-${Math.random()}`;
    const newQuestion: QuizQuestion = {
      text: "",
      answer: "",
      isCollapsed: false,
      tempId,
    };
    append(newQuestion);
    setLastAddedTempId(tempId);

    // Clear after a short delay
    setTimeout(() => setLastAddedTempId(null), 500);
  };

  const removeQuestion = (tempId: string): void => {
    const questionToDelete = fields.find((q) => q.tempId === tempId);

    if (questionToDelete) {
      setDeleteQuestionDialog({
        open: true,
        questionToDelete: questionToDelete as QuizQuestion,
      });
    }
  };

  const confirmRemoveQuestion = (): void => {
    if (!deleteQuestionDialog.questionToDelete) return;

    const index = fields.findIndex(
      (q) => q.tempId === deleteQuestionDialog.questionToDelete?.tempId,
    );

    if (index !== -1) {
      remove(index);
    }

    setDeleteQuestionDialog({
      open: false,
      questionToDelete: null,
    });
  };

  const addRecycledQuestion = (question: Question): void => {
    const newTempId = `recycled-${question.id}`;

    if (fields.some((q) => q.tempId === newTempId)) {
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

    append(recycledQuestion);
    toast.success("Question added successfully!");
  };

  const toggleCollapse = (tempId: string): void => {
    const index = fields.findIndex((q) => q.tempId === tempId);
    if (index !== -1) {
      const field = fields[index] as QuizQuestion;
      update(index, { ...field, isCollapsed: !field.isCollapsed });
    }
  };

  const reorderQuestions = (newOrder: QuizQuestion[]): void => {
    replace(newOrder);
  };

  return {
    fields: fields as QuizQuestion[],
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
    lastAddedTempId,
  };
}
