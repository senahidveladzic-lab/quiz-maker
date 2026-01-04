"use client";

import { QuizForm } from "@/components/quizzes/quiz-form";
import { useCreateQuizForm } from "@/hooks/facade/use-create-quiz-form";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const router = useRouter();
  const formData = useCreateQuizForm();

  return (
    <PageContainer className="pb-32 max-w-4xl">
      <nav aria-label="Breadcrumb">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>
      </nav>
      <header>
        <PageHeader
          title="Create New Quiz"
          description="Add a name and questions to create your quiz"
        />
      </header>
      <QuizForm formData={formData} submitText="Create Quiz" />
    </PageContainer>
  );
}
