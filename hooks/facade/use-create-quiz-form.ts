"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useCreateQuiz, useQuestions, useQuizzes } from "@/lib/api/quiz-api";
import { Question, QuizFormData, UseQuizFormReturn } from "@/lib/types";
import { quizFormSchema } from "@/lib/schemas/quiz-schema";
import { useQuizQuestions } from "@/hooks/use-quiz-questions";

export function useCreateQuizForm(): UseQuizFormReturn {
  const router = useRouter();
  const createQuizMutation = useCreateQuiz();
  const { data: allQuestions = [], isLoading: loadingQuestions } =
    useQuestions();
  const { data: existingQuizzes } = useQuizzes();

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      name: "",
      questions: [],
    },
  });

  const questionManager = useQuizQuestions({
    form,
    allQuestions,
  });

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

  return {
    form,
    isLoadingQuestions: loadingQuestions,
    isSubmitting: createQuizMutation.isPending,
    onSubmit,
    ...questionManager,
  };
}
