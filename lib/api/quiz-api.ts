import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Quiz, Question, QuizCreateDto } from "../types";
import { API_URL } from "@/lib/config";

// ============================================
// API Functions
// ============================================

export const api = {
  getQuizzes: async (): Promise<Quiz[]> => {
    const response = await fetch(`${API_URL}/quizzes`);
    if (!response.ok) throw new Error("Failed to fetch quizzes");
    return response.json();
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await fetch(`${API_URL}/quizzes/${id}`);
    if (!response.ok) throw new Error("Failed to fetch quiz");
    return response.json();
  },

  createQuiz: async (data: QuizCreateDto): Promise<Quiz> => {
    const response = await fetch(`${API_URL}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create quiz");
    return response.json();
  },

  updateQuiz: async (
    id: string,
    data: Partial<QuizCreateDto>,
  ): Promise<Quiz> => {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update quiz");
    return response.json();
  },

  deleteQuiz: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete quiz");
  },

  getQuestions: async (): Promise<Question[]> => {
    const response = await fetch(`${API_URL}/questions`);
    if (!response.ok) throw new Error("Failed to fetch questions");
    return response.json();
  },
};

// ============================================
// React Query Hooks
// ============================================

// Query Keys
export const queryKeys = {
  quizzes: ["quizzes"] as const,
  quiz: (id: string) => ["quizzes", id] as const,
  questions: ["questions"] as const,
};

// ============================================
// Quiz Hooks
// ============================================

export function useQuizzes() {
  return useQuery({
    queryKey: queryKeys.quizzes,
    queryFn: api.getQuizzes,
  });
}

export function useQuiz(id: string) {
  return useQuery({
    queryKey: queryKeys.quiz(id),
    queryFn: () => api.getQuizById(id),
    enabled: !!id,
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes });
    },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QuizCreateDto> }) =>
      api.updateQuiz(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes });
    },
  });
}

// ============================================
// Question Hooks
// ============================================

export function useQuestions() {
  return useQuery({
    queryKey: queryKeys.questions,
    queryFn: api.getQuestions,
  });
}
