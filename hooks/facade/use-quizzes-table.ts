"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDeleteQuiz, useQuizzes } from "@/lib/api/quiz-api";
import { Quiz } from "@/lib/types";
import { UseQueryResult } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 10;

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

  // Pagination
  currentPage: number;
  totalPages: number;
  paginatedQuizzes: Quiz[];
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
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

  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = quizzes?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const safePage = useMemo(() => {
    if (totalPages === 0) return 1;
    return Math.min(Math.max(1, currentPage), totalPages);
  }, [currentPage, totalPages]);

  const paginatedQuizzes = useMemo(() => {
    if (!quizzes) return [];

    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return quizzes.slice(startIndex, endIndex);
  }, [quizzes, safePage]);

  const handleDeleteClick = (quiz: Quiz) => {
    setDeleteDialog({ open: true, quiz });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.quiz) return;

    try {
      await deleteQuizMutation.mutateAsync(deleteDialog.quiz.id);
      setDeleteDialog({ open: false, quiz: null });

      if (paginatedQuizzes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
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

    currentPage: safePage,
    totalPages,
    paginatedQuizzes,
    setCurrentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems,
  };
}
