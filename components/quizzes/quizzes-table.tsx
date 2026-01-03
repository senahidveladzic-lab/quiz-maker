"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Play } from "lucide-react";
import { useDeleteQuiz, useQuizzes } from "@/lib/api";
import { Quiz } from "@/lib/types";
import { ReusableDialog } from "@/components/common/reusable-dialog";
import { useRouter } from "next/navigation";

export function QuizzesTable() {
  const { data: quizzes, isLoading, error } = useQuizzes();
  const deleteQuizMutation = useDeleteQuiz();
  const router = useRouter();
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

  if (isLoading) {
    return <div className="text-center py-8">Loading quizzes...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading quizzes: {error.message}
      </div>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No quizzes found. Create your first quiz to get started!
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz Name</TableHead>
              <TableHead className="text-center">Questions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow
                key={quiz.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleEditClick(quiz)}
              >
                <TableCell className="font-medium">{quiz.name}</TableCell>
                <TableCell className="text-center">
                  {quiz.questionIds.length}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewClick(quiz);
                      }}
                      title="View Quiz"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(quiz);
                      }}
                      title="Edit Quiz"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(quiz);
                      }}
                      title="Delete Quiz"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ReusableDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, quiz: open ? deleteDialog.quiz : null })
        }
        variant="danger"
        title="Delete Quiz"
        description={`Are you sure you want to delete "${deleteDialog.quiz?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteQuizMutation.isPending}
      />
    </>
  );
}
