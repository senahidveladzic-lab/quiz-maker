"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuizCompletionCardProps {
  visible: boolean;
  onShare: () => void;
  onBackToQuizzes: () => void;
  message?: string;
}

export function QuizCompletionCard({
  visible,
  onShare,
  onBackToQuizzes,
  message = "🎉 Congratulations! You have completed the quiz!",
}: QuizCompletionCardProps) {
  if (!visible) return null;

  return (
    <section aria-label="Quiz completion" className="mt-8 text-center">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 space-y-4">
          <p className="text-lg font-medium">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onShare} variant="outline" size="lg">
              <Share2 className="mr-2 h-4 w-4" />
              Share Quiz
            </Button>
            <Button onClick={onBackToQuizzes} size="lg">
              Back to Quizzes
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
