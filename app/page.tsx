"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuizzesTable } from "@/components/quizzes/quizzes-table";

export default function Home() {
  const router = useRouter();

  const handleCreateQuiz = () => {
    router.push("/quizzes/create");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Quiz Maker</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your quizzes
            </p>
          </div>
          <Button onClick={handleCreateQuiz} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Quiz
          </Button>
        </div>

        <QuizzesTable />
      </div>
    </div>
  );
}
