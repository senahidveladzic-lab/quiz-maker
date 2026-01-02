"use client";

import { AlertCircle } from "lucide-react";
import { ReusableDialog } from "@/components/common/reusable-dialog";

interface QuestionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateGlobally: () => void;
  onCreateNew: () => void;
  questionText: string;
}

export function QuestionEditDialog({
  open,
  onOpenChange,
  onUpdateGlobally,
  onCreateNew,
  questionText,
}: QuestionEditDialogProps) {
  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Question Strategy"
      variant="default"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              This question is used in multiple quizzes
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              &#34;{questionText}&#34;
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          How would you like to proceed with editing this question?
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              onUpdateGlobally();
              onOpenChange(false);
            }}
            className="w-full text-left p-4 rounded-lg border-2 hover:border-primary hover:bg-accent transition-colors"
          >
            <div className="font-medium mb-1">Update Globally</div>
            <div className="text-sm text-muted-foreground">
              Changes will affect all quizzes using this question
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onCreateNew();
              onOpenChange(false);
            }}
            className="w-full text-left p-4 rounded-lg border-2 hover:border-primary hover:bg-accent transition-colors"
          >
            <div className="font-medium mb-1">Create New Version</div>
            <div className="text-sm text-muted-foreground">
              Creates a new question, keeping the original unchanged for other
              quizzes
            </div>
          </button>
        </div>
      </div>
    </ReusableDialog>
  );
}
