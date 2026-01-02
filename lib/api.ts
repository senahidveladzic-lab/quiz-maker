import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Quiz, Question, QuizCreateDto, QuestionCreateDto } from "./types";

const API_BASE_URL = "http://localhost:3001";

// ============================================
// API Functions
// ============================================

export const api = {
  // Quizzes
  getQuizzes: async (): Promise<Quiz[]> => {
    const response = await fetch(`${API_BASE_URL}/quizzes`);
    if (!response.ok) throw new Error("Failed to fetch quizzes");
    return response.json();
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
    if (!response.ok) throw new Error("Failed to fetch quiz");
    return response.json();
  },

  createQuiz: async (data: QuizCreateDto): Promise<Quiz> => {
    const response = await fetch(`${API_BASE_URL}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) throw new Error("Failed to create quiz");
    return response.json();
  },

  updateQuiz: async (
    id: string,
    data: Partial<QuizCreateDto>,
  ): Promise<Quiz> => {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update quiz");
    return response.json();
  },

  deleteQuiz: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete quiz");
  },

  // Questions
  getQuestions: async (): Promise<Question[]> => {
    const response = await fetch(`${API_BASE_URL}/questions`);
    if (!response.ok) throw new Error("Failed to fetch questions");
    return response.json();
  },

  getQuestionById: async (id: string): Promise<Question> => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`);
    if (!response.ok) throw new Error("Failed to fetch question");
    return response.json();
  },

  getQuestionsByIds: async (ids: string[]): Promise<Question[]> => {
    const questions = await api.getQuestions();
    return questions.filter((q) => ids.includes(q.id));
  },

  createQuestion: async (data: QuestionCreateDto): Promise<Question> => {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create question");
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
  question: (id: string) => ["questions", id] as const,
  quizQuestions: (ids: string[]) => ["questions", "byIds", ids] as const,
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
      // Invalidate and refetch quizzes list
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
      // Invalidate both the specific quiz and the list
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
      // Invalidate quizzes list
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

export function useQuestion(id: string) {
  return useQuery({
    queryKey: queryKeys.question(id),
    queryFn: () => api.getQuestionById(id),
    enabled: !!id,
  });
}

export function useQuestionsByIds(ids: string[]) {
  return useQuery({
    queryKey: queryKeys.quizQuestions(ids),
    queryFn: () => api.getQuestionsByIds(ids),
    enabled: ids.length > 0,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createQuestion,
    onSuccess: () => {
      // Invalidate questions list
      queryClient.invalidateQueries({ queryKey: queryKeys.questions });
    },
  });
}
