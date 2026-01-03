"use client";

import { QuizForm } from "@/components/quizzes/quiz-form";
import { useCreateQuizForm } from "@/hooks/facade/use-create-quiz-form";

export default function CreateQuizPage() {
  const formData = useCreateQuizForm();

  return (
    <QuizForm
      title="Create New Quiz"
      description="Add a name and questions to create your quiz"
      submitText="Create Quiz"
      formData={formData}
    />
  );
}
