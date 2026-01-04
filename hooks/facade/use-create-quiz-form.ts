"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { useCreateQuiz, useQuestions, useQuizzes } from "@/lib/api/quiz-api";
import {
  Question,
  QuizQuestion,
  QuizFormData,
  UseQuizFormReturn,
} from "@/lib/types";

// ============================================
// Schema
// ============================================

const createQuizSchema = z
  .object({
    name: z
      .string()
      .min(1, "Quiz name is required")
      .min(3, "Quiz name must be at least 3 characters")
      .max(100, "Quiz name must be less than 100 characters"),
    questions: z.array(
      z.object({
        id: z.string().optional(),
        text: z
          .string()
          .min(1, "Question text is required")
          .min(5, "Question must be at least 5 characters"),
        answer: z
          .string()
          .min(1, "Answer is required")
          .min(3, "Answer must be at least 3 characters"),
        isCollapsed: z.boolean(),
        tempId: z.string(),
      }),
    ),
  })
  .refine((data) => data.questions.length > 0, {
    message: "At least one question is required",
    path: ["questions"],
  });

// ============================================
// Hook
// ============================================

export function useCreateQuizForm(): UseQuizFormReturn {
  const router = useRouter();
  const createQuizMutation = useCreateQuiz();
  const { data: allQuestions = [], isLoading: loadingQuestions } =
    useQuestions();
  const { data: existingQuizzes } = useQuizzes();

  const [deleteQuestionDialog, setDeleteQuestionDialog] = useState<{
    open: boolean;
    questionToDelete: QuizQuestion | null;
  }>({
    open: false,
    questionToDelete: null,
  });

  const form = useForm<QuizFormData>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      name: "",
      questions: [],
    },
  });

  const questions = form.watch("questions");

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
    form.setValue("questions", [...current, newQuestion]);
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
    if (current.some((q) => q.id === question.id)) {
      return;
    }

    const recycledQuestion: QuizQuestion = {
      text: question.text,
      answer: question.answer,
      isCollapsed: true,
      tempId: `recycled-${question.id}-${Date.now()}`,
    };
    form.setValue("questions", [...current, recycledQuestion]);
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

  const onSubmit = async (data: QuizFormData): Promise<void> => {
    const isDuplicate = existingQuizzes?.some(
      (quiz) => quiz.name.toLowerCase() === data.name.toLowerCase(),
    );

    if (isDuplicate) {
      form.setError("name", {
        type: "manual",
        message: "A quiz with this name already exists",
      });
      return;
    }

    try {
      const finalQuestions: Question[] = data.questions.map((q, index) => ({
        id: q.id || `q-${Date.now()}-${index}`,
        text: q.text,
        answer: q.answer,
      }));

      await createQuizMutation.mutateAsync({
        name: data.name,
        questions: finalQuestions,
      });

      toast.success("Quiz created successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to create quiz. Please try again.");
      console.error("Error creating quiz:", error);
    }
  };

  const isSubmitting = createQuizMutation.isPending;
  const totalQuestions = questions.length;

  return {
    form,
    availableQuestions,
    isLoadingQuestions: loadingQuestions,
    questions,
    totalQuestions,
    isSubmitting,
    onSubmit,
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
