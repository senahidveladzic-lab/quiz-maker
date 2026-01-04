"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useUpdateQuiz, useQuestions, useQuizzes } from "@/lib/api/quiz-api";
import { Quiz, Question, QuizFormData, UseQuizFormReturn } from "@/lib/types";
import { quizFormSchema } from "@/lib/schemas/quiz-schema";
import { useQuizQuestions } from "@/hooks/use-quiz-questions";

export function useEditQuizForm(quiz: Quiz): UseQuizFormReturn {
  const router = useRouter();
  const { data: allQuestions = [], isLoading: loadingQuestions } =
    useQuestions();
  const { data: existingQuizzes } = useQuizzes();
  const updateQuizMutation = useUpdateQuiz();

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      name: quiz.name,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        text: q.text,
        answer: q.answer,
        isCollapsed: true,
        tempId: `existing-${q.id}`,
      })),
    },
  });

  const questionManager = useQuizQuestions({
    form,
    allQuestions,
  });

  const onSubmit = async (data: QuizFormData): Promise<void> => {
    const isDuplicate = existingQuizzes?.some(
      (q) =>
        q.id !== quiz.id && q.name.toLowerCase() === data.name.toLowerCase(),
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

      await updateQuizMutation.mutateAsync({
        id: quiz.id,
        data: {
          name: data.name,
          questions: finalQuestions,
        },
      });

      toast.success("Quiz updated successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to update quiz. Please try again.");
      console.error("Error updating quiz:", error);
    }
  };

  return {
    form,
    isLoadingQuestions: loadingQuestions,
    isSubmitting: updateQuizMutation.isPending,
    onSubmit,
    ...questionManager,
  };
}
