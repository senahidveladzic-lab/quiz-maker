"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import {
  useCreateQuiz,
  useCreateQuestion,
  useQuestions,
  useQuizzes,
} from "@/lib/api";
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

export function useCreateQuizForm(): UseQuizFormReturn {
  const router = useRouter();
  const createQuizMutation = useCreateQuiz();
  const createQuestionMutation = useCreateQuestion();
  const { data: allQuestions = [], isLoading: loadingQuestions } =
    useQuestions();
  const { data: existingQuizzes } = useQuizzes();

  const form = useForm<QuizFormData>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      name: "",
      questions: [],
    },
  });

  const questions = form.watch("questions");

  // Filter out already selected questions
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

  const onSubmit = async (data: QuizFormData) => {
    // Check for duplicate quiz name
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
      const finalQuestionIds: string[] = [];

      // Process questions in order
      for (const question of data.questions) {
        if (question.type === "new") {
          // Create new question
          const created = await createQuestionMutation.mutateAsync({
            text: question.text,
            answer: question.answer,
          });
          finalQuestionIds.push(created.id);
        } else if (question.type === "recycled") {
          // Use existing question ID
          if (question.id) {
            finalQuestionIds.push(question.id);
          }
        }
      }

      // Create the quiz
      await createQuizMutation.mutateAsync({
        name: data.name,
        questionIds: finalQuestionIds,
      });

      toast.success("Quiz created successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to create quiz. Please try again.");
      console.error("Error creating quiz:", error);
    }
  };

  const isSubmitting =
    createQuizMutation.isPending || createQuestionMutation.isPending;

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
    addRecycledQuestion,
    toggleCollapse,
    reorderQuestions,
  };
}
