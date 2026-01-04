"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizForm } from "@/components/quizzes/quiz-form";
import { useQuiz } from "@/lib/api/quiz-api";
import { useEditQuizForm } from "@/hooks/facade/use-edit-quiz-form";
import { Quiz } from "@/lib/types";

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const { data: quiz, isLoading } = useQuiz(quizId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
          <Button onClick={() => router.push("/")}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  return <EditQuizPageContent quiz={quiz} />;
}

function EditQuizPageContent({ quiz }: { quiz: Quiz }) {
  const formData = useEditQuizForm(quiz);

  return (
    <QuizForm
      title="Edit Quiz"
      description="Update your quiz name and questions"
      submitText="Update Quiz"
      formData={formData}
    />
  );
}
