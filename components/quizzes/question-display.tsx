"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@/lib/types";

interface QuestionDisplayProps {
  question: Question;
  isAnswerRevealed: boolean;
  onRevealAnswer: () => void;
  touchHandlers?: Record<string, any>;
}

export function QuestionDisplay({
  question,
  isAnswerRevealed,
  onRevealAnswer,
  touchHandlers,
}: QuestionDisplayProps) {
  return (
    <div {...touchHandlers}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">{question.text}</p>

          <div className="space-y-4">
            {!isAnswerRevealed ? (
              <Button
                onClick={onRevealAnswer}
                size="lg"
                className="w-full gap-2"
              >
                <Eye className="h-5 w-5" />
                Reveal Answer
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  Answer
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-lg leading-relaxed">{question.answer}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
