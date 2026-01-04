"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuizzesTable } from "@/components/quizzes/quizzes-table";
import { PageHeader } from "@/components/common/page-header";

export default function Home() {
  const router = useRouter();

  const handleCreateQuiz = () => {
    router.push("/quizzes/create");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
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

        <QuizzesTable />
      </div>
    </div>
  );
}
