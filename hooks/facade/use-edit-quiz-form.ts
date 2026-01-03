"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { z } from "zod";

import {
  useQuiz,
  useQuestionsByIds,
  useUpdateQuiz,
  useCreateQuestion,
  useUpdateQuestion,
  useQuestions,
  useQuizzes,
} from "@/lib/api";
import {
  Question,
  QuizQuestion,
  QuizFormData,
  UseEditQuizFormReturn,
} from "@/lib/types";

// ============================================
// Remove the duplicate interface definition here
// ============================================

// ============================================
// Schema
// ============================================

const editQuizSchema = z
  .object({
    name: z
      .string()
      .min(1, "Quiz name is required")
      .min(3, "Quiz name must be at least 3 characters")
      .max(100, "Quiz name must be less than 100 characters"),
    questions: z.array(
      z.object({
        id: z.string().optional(),
        text: z.string().min(1, "Question text is required").min(5),
        answer: z.string().min(1, "Answer is required").min(3),
        type: z.enum(["existing", "new", "recycled"]),
        isCollapsed: z.boolean(),
        tempId: z.string(),
        originalText: z.string().optional(),
        originalAnswer: z.string().optional(),
        willUpdateGlobally: z.boolean().optional(),
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

export function useEditQuizForm(quizId: string): UseEditQuizFormReturn {
  const router = useRouter();
  const { data: quiz, isLoading: loadingQuiz } = useQuiz(quizId);
  const { data: quizQuestions } = useQuestionsByIds(quiz?.questionIds || []);
  const { data: allQuestions = [], isLoading: loadingQuestions } =
    useQuestions();
  const { data: existingQuizzes } = useQuizzes();

  const updateQuizMutation = useUpdateQuiz();
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();

  const [editStrategyDialog, setEditStrategyDialog] = useState<{
    open: boolean;
    questionTempId: string | null;
    questionText: string;
  }>({
    open: false,
    questionTempId: null,
    questionText: "",
  });

  const form = useForm<QuizFormData>({
    resolver: zodResolver(editQuizSchema),
    defaultValues: {
      name: "",
      questions: [],
    },
  });

  // Load quiz data into form
  useEffect(() => {
    if (quiz && quizQuestions) {
      const existingQuestions: QuizQuestion[] = quizQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        answer: q.answer,
        type: "existing",
        isCollapsed: true,
        tempId: `existing-${q.id}-${Date.now()}`,
        originalText: q.text,
        originalAnswer: q.answer,
        willUpdateGlobally: false,
      }));

      form.reset({
        name: quiz.name,
        questions: existingQuestions,
      });
    }
  }, [quiz, quizQuestions, form]);

  const questions = form.watch("questions");

  // Get available questions (exclude already used ones)
  const availableQuestions = allQuestions.filter(
    (q) => !questions.some((qq) => qq.id === q.id),
  );

  const addNewQuestion = () => {
    const current = form.getValues("questions");
    const newQuestion: QuizQuestion = {
      text: "",
      answer: "",
      type: "new",
      isCollapsed: false,
      tempId: `new-${Date.now()}-${Math.random()}`,
    };
    form.setValue("questions", [...current, newQuestion]);
  };

  const removeQuestion = (tempId: string) => {
    const current = form.getValues("questions");
    form.setValue(
      "questions",
      current.filter((q) => q.tempId !== tempId),
    );
  };

  const addRecycledQuestion = (question: Question) => {
    const current = form.getValues("questions");
    if (current.some((q) => q.id === question.id)) {
      return;
    }

    const recycledQuestion: QuizQuestion = {
      id: question.id,
      text: question.text,
      answer: question.answer,
      type: "recycled",
      isCollapsed: true,
      tempId: `recycled-${question.id}-${Date.now()}`,
    };
    form.setValue("questions", [...current, recycledQuestion]);
  };

  const toggleCollapse = (tempId: string) => {
    const current = form.getValues("questions");
    const updated = current.map((q) =>
      q.tempId === tempId ? { ...q, isCollapsed: !q.isCollapsed } : q,
    );
    form.setValue("questions", updated);
  };

  const reorderQuestions = (newOrder: QuizQuestion[]) => {
    form.setValue("questions", newOrder);
  };

  const checkQuestionModified = (tempId: string) => {
    const current = form.getValues("questions");
    const question = current.find((q) => q.tempId === tempId);

    if (!question || question.type !== "existing") return;

    const isModified =
      question.text !== question.originalText ||
      question.answer !== question.originalAnswer;

    if (isModified && !question.willUpdateGlobally) {
      setEditStrategyDialog({
        open: true,
        questionTempId: tempId,
        questionText: question.originalText || "",
      });
    }
  };

  const handleUpdateGlobally = () => {
    if (!editStrategyDialog.questionTempId) return;

    const current = form.getValues("questions");
    const updated = current.map((q) =>
      q.tempId === editStrategyDialog.questionTempId
        ? { ...q, willUpdateGlobally: true }
        : q,
    );
    form.setValue("questions", updated);
    setEditStrategyDialog({
      open: false,
      questionTempId: null,
      questionText: "",
    });
  };

  const handleCreateNewVersion = () => {
    if (!editStrategyDialog.questionTempId) return;

    const current = form.getValues("questions");
    const questionIndex = current.findIndex(
      (q) => q.tempId === editStrategyDialog.questionTempId,
    );

    if (questionIndex === -1) return;

    const question = current[questionIndex];

    const updatedQuestions = [...current];
    updatedQuestions[questionIndex] = {
      ...question,
      type: "new",
      id: undefined,
      originalText: undefined,
      originalAnswer: undefined,
      willUpdateGlobally: undefined,
    };

    form.setValue("questions", updatedQuestions);
    setEditStrategyDialog({
      open: false,
      questionTempId: null,
      questionText: "",
    });
  };

  const onSubmit = async (data: QuizFormData) => {
    const isDuplicate = existingQuizzes?.some(
      (q) =>
        q.id !== quizId && q.name.toLowerCase() === data.name.toLowerCase(),
    );

    if (isDuplicate) {
      form.setError("name", {
        type: "manual",
        message: "A quiz with this name already exists",
      });
      return;
    }

    try {
      const finalQuestionIds: string[] = [];

      for (const question of data.questions) {
        if (question.type === "existing") {
          if (question.willUpdateGlobally && question.id) {
            await updateQuestionMutation.mutateAsync({
              id: question.id,
              data: { text: question.text, answer: question.answer },
            });
          }
          if (question.id) {
            finalQuestionIds.push(question.id);
          }
        } else if (question.type === "new") {
          const created = await createQuestionMutation.mutateAsync({
            text: question.text,
            answer: question.answer,
          });
          finalQuestionIds.push(created.id);
        } else if (question.type === "recycled") {
          if (question.id) {
            finalQuestionIds.push(question.id);
          }
        }
      }

      await updateQuizMutation.mutateAsync({
        id: quizId,
        data: {
          name: data.name,
          questionIds: finalQuestionIds,
        },
      });

      toast.success("Quiz updated successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to update quiz. Please try again.");
      console.error("Error updating quiz:", error);
    }
  };

  const isSubmitting =
    updateQuizMutation.isPending ||
    createQuestionMutation.isPending ||
    updateQuestionMutation.isPending;

  const totalQuestions = questions.length;
  const quizNotFound = !loadingQuiz && !quiz;

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
    addRecycledQuestion,
    toggleCollapse,
    reorderQuestions,
    checkQuestionModified,
    isLoadingQuiz: loadingQuiz,
    quizNotFound,
    editStrategyDialog,
    setEditStrategyDialog,
    handleUpdateGlobally,
    handleCreateNewVersion,
  };
}
