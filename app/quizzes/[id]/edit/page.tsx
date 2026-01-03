"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizForm } from "@/components/quizzes/quiz-form";
import { useEditQuizForm } from "@/hooks/facade/use-edit-quiz-form";

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const formData = useEditQuizForm(quizId);

  if (formData.isLoadingQuiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (formData.quizNotFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
          <Button onClick={() => router.push("/")}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  return (
    <QuizForm
      title="Edit Quiz"
      description="Update your quiz name and questions"
      submitText="Update Quiz"
      formData={formData}
      editDialogProps={{
        editStrategyDialog: formData.editStrategyDialog,
        setEditStrategyDialog: formData.setEditStrategyDialog,
        handleUpdateGlobally: formData.handleUpdateGlobally,
        handleCreateNewVersion: formData.handleCreateNewVersion,
      }}
    />
  );
}
