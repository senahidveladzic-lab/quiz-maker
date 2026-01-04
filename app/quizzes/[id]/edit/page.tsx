"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizForm } from "@/components/quizzes/quiz-form";
import { useQuiz } from "@/lib/api/quiz-api";
import { useEditQuizForm } from "@/hooks/facade/use-edit-quiz-form";
import { LoadingState } from "@/components/common/loading-state";
import { NotFoundState } from "@/components/common/not-found-state";
import { PageHeader } from "@/components/common/page-header";
import { Quiz } from "@/lib/types";
import { PageContainer } from "@/components/layout/page-container";

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const { data: quiz, isLoading } = useQuiz(quizId);

  if (isLoading) {
    return <LoadingState message="Loading quiz..." />;
  }

  if (!quiz) {
    return (
      <NotFoundState
        title="Quiz Not Found"
        description="The quiz you're looking for doesn't exist or has been deleted."
        actionLabel="Back to Quizzes"
        onAction={() => router.push("/")}
      />
    );
  }

  return <EditQuizPageContent quiz={quiz} />;
}

function EditQuizPageContent({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const formData = useEditQuizForm(quiz);

  return (
    <PageContainer className="pb-32 max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>
      </nav>

      <header>
        <PageHeader
          title="Edit Quiz"
          description="Update your quiz name and questions"
        />
      </header>

      <QuizForm formData={formData} submitText="Update Quiz" />
    </PageContainer>
  );
}
