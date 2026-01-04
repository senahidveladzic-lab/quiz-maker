"use client";

import { useParams } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Eye,
  Home,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlayQuiz } from "@/hooks/facade/use-play-quiz";

export default function PlayQuizPage() {
  const params = useParams();
  const quizId = params.id as string;

  const {
    quiz,
    isLoading,
    currentQuestion,
    totalQuestions,
    currentIndex,
    canGoPrevious,
    canGoNext,
    isLastQuestion,
    progressPercentage,
    isAnswerRevealed,
    showEndMessage,
    touchHandlers,
    handlePrevious,
    handleNext,
    handleRevealAnswer,
    handleBackToQuizzes,
    handleShare,
  } = usePlayQuiz(quizId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!quiz || !currentQuestion) {
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
    <section className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{quiz.name}</h1>
            <p className="text-muted-foreground mt-1">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              title="Share Quiz"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleBackToQuizzes}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Quizzes</span>
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div {...touchHandlers}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed">{currentQuestion.text}</p>

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
                          {currentQuestion.answer}
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
        {isAnswerRevealed && (
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Previous
            </Button>

            {!isLastQuestion && (
              <>
                <div className="text-xs text-muted-foreground text-center">
                  Swipe / Arrow keys
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {isLastQuestion && <div className="flex-1" />}
          </div>
        )}

        {showEndMessage && (
          <div className="mt-8 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <p className="text-lg font-medium">
                  🎉 Congratulations! You have completed the quiz!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleShare} variant="outline" size="lg">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Quiz
                  </Button>
                  <Button onClick={handleBackToQuizzes} size="lg">
                    Back to Quizzes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
