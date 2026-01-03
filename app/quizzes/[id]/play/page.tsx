"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ArrowRight, Eye, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuiz, useQuestionsByIds } from "@/lib/api";

export default function PlayQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const { data: quiz, isLoading: loadingQuiz } = useQuiz(quizId);
  const { data: questions, isLoading: loadingQuestions } = useQuestionsByIds(
    quiz?.questionIds || [],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(
    new Set(),
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const isLoading = loadingQuiz || loadingQuestions;
  const currentQuestion = questions?.[currentIndex];
  const totalQuestions = questions?.length || 0;
  const isAnswerRevealed = revealedAnswers.has(currentIndex);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRevealAnswer = () => {
    setRevealedAnswers(new Set([...revealedAnswers, currentIndex]));
  };

  const handleBackToQuizzes = () => {
    router.push("/");
  };

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === " " && !isAnswerRevealed) {
        e.preventDefault();
        handleRevealAnswer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalQuestions, isAnswerRevealed]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!quiz || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
          <Button onClick={handleBackToQuizzes}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{quiz.name}</h1>
            <p className="text-muted-foreground mt-1">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleBackToQuizzes}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Quizzes
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed">{currentQuestion?.text}</p>

              {/* Answer Section */}
              <div className="space-y-4">
                {!isAnswerRevealed ? (
                  <Button
                    onClick={handleRevealAnswer}
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
                        <p className="text-lg leading-relaxed">
                          {currentQuestion?.answer}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Swipe or use arrow keys to navigate
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={handleNext}
            disabled={currentIndex === totalQuestions - 1}
            className="gap-2"
          >
            Next
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* End of Quiz Message */}
        {currentIndex === totalQuestions - 1 && (
          <div className="mt-8 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-lg font-medium mb-4">
                  🎉 You've reached the end of the quiz!
                </p>
                <Button onClick={handleBackToQuizzes} size="lg">
                  Back to Quizzes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
