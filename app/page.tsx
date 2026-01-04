"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuizzesTable } from "@/components/quizzes/quizzes-table";
import { PageHeader } from "@/components/common/page-header";
import { PageContainer } from "@/components/layout/page-container";

export default function Home() {
  const router = useRouter();

  const handleCreateQuiz = () => {
    router.push("/quizzes/create");
  };

  return (
    <PageContainer>
      <header>
        <PageHeader
          title="Quiz Maker"
          description="Create and manage your quizzes"
          actions={
            <Button onClick={handleCreateQuiz} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Quiz
            </Button>
          }
        />
      </header>

      <section aria-label="Your quizzes">
        <QuizzesTable />
      </section>
    </PageContainer>
  );
}
