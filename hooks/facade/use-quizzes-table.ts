"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteQuiz, useQuizzes } from "@/lib/api/quiz-api";
import { Quiz } from "@/lib/types";
import { UseQueryResult } from "@tanstack/react-query";

export interface UseQuizzesTableReturn {
  quizzes: Quiz[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: UseQueryResult<Quiz[], Error>["refetch"];
  deleteDialog: {
    open: boolean;
    quiz: Quiz | null;
  };
  setDeleteDialog: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      quiz: Quiz | null;
    }>
  >;

  isDeleting: boolean;

  handleDeleteClick: (quiz: Quiz) => void;
  handleDeleteConfirm: () => Promise<void>;
  handleEditClick: (quiz: Quiz) => void;
  handleViewClick: (quiz: Quiz) => void;
}

export function useQuizzesTable(): UseQuizzesTableReturn {
  const router = useRouter();
  const { data: quizzes, isLoading, error, refetch } = useQuizzes();
  const deleteQuizMutation = useDeleteQuiz();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    quiz: Quiz | null;
  }>({
    open: false,
    quiz: null,
  });

  const handleDeleteClick = (quiz: Quiz) => {
    setDeleteDialog({ open: true, quiz });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.quiz) return;

    try {
      await deleteQuizMutation.mutateAsync(deleteDialog.quiz.id);
      setDeleteDialog({ open: false, quiz: null });
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    }
  };

  const handleEditClick = (quiz: Quiz) => {
    router.push(`/quizzes/${quiz.id}/edit`);
  };

  const handleViewClick = (quiz: Quiz) => {
    router.push(`/quizzes/${quiz.id}/play`);
  };

  return {
    quizzes,
    isLoading,
    error,
    refetch,
    deleteDialog,
    setDeleteDialog,
    isDeleting: deleteQuizMutation.isPending,
    handleDeleteClick,
    handleDeleteConfirm,
    handleEditClick,
    handleViewClick,
  };
}
