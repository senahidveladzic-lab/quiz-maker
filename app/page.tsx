"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuizzesTable } from "@/components/quizzes/quizzes-table";


export default function Home() {
  const handleCreateQuiz = () => {
    // TODO: Implement create quiz functionality
    console.log("Create new quiz");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
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