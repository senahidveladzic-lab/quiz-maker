"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Play, FileQuestion } from "lucide-react";
import { ReusableDialog } from "@/components/common/reusable-dialog";
import { TablePagination } from "@/components/common/table-pagination";
import { useQuizzesTable } from "@/hooks/facade/use-quizzes-table";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";

export function QuizzesTable() {
  const {
    quizzes,
    isLoading,
    error,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    handleDeleteClick,
    handleDeleteConfirm,
    handleEditClick,
    handleViewClick,
    refetch,
    currentPage,
    totalPages,
    paginatedQuizzes,
    setCurrentPage,
    totalItems,
    itemsPerPage,
  } = useQuizzesTable();

  if (isLoading) {
    return <div className="text-center py-8">Loading quizzes...</div>;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load quizzes"
        message={
          error.message || "An error occurred while loading your quizzes."
        }
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="No quizzes found"
        description="Create your first quiz to get started!"
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
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
              {paginatedQuizzes.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleEditClick(quiz)}
                >
                  <TableCell className="font-medium">{quiz.name}</TableCell>
                  <TableCell className="text-center">
                    {quiz.questions?.length}
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
                        title="Play Quiz"
                        aria-label={`Play ${quiz.name}`}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(quiz);
                        }}
                        title="Delete Quiz"
                        aria-label={`Delete ${quiz.name}`}
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

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemName="quizzes"
        />
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
        isLoading={isDeleting}
      />
    </>
  );
}
