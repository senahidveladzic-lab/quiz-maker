"use client";

import { useParams } from "next/navigation";
import { Home, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayQuiz } from "@/hooks/facade/use-play-quiz";
import { PageHeader } from "@/components/common/page-header";
import { LoadingState } from "@/components/common/loading-state";
import { NotFoundState } from "@/components/common/not-found-state";
import { ProgressBar } from "@/components/common/progress-bar";
import { QuestionDisplay } from "@/components/quizzes/question-display";
import { QuizNavigation } from "@/components/quizzes/quiz-navigation";
import { QuizCompletionCard } from "@/components/quizzes/quiz-completion-card";
import { PageContainer } from "@/components/layout/page-container";

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
    return <LoadingState message="Loading quiz..." />;
  }

  if (!quiz || !currentQuestion) {
    return (
      <NotFoundState
        title="Quiz Not Found"
        description="The quiz you're trying to play doesn't exist or has been deleted."
        actionLabel="Back to Quizzes"
        onAction={handleBackToQuizzes}
      />
    );
  }

  return (
    <PageContainer className="max-w-4xl">
      <header>
        <PageHeader
          title={quiz.name}
          description={`Question ${currentIndex + 1} of ${totalQuestions}`}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                title="Share Quiz"
                aria-label="Share quiz"
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
          }
        />
      </header>

      <section aria-label="Quiz progress" className="mb-8">
        <ProgressBar
          current={currentIndex + 1}
          total={totalQuestions}
          percentage={progressPercentage}
        />
      </section>

      <article aria-label="Current question" className="mb-6">
        <QuestionDisplay
          question={currentQuestion}
          isAnswerRevealed={isAnswerRevealed}
          onRevealAnswer={handleRevealAnswer}
          touchHandlers={touchHandlers}
        />
      </article>

      <QuizNavigation
        visible={isAnswerRevealed}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        isLastQuestion={isLastQuestion}
      />

      <QuizCompletionCard
        visible={showEndMessage}
        onShare={handleShare}
        onBackToQuizzes={handleBackToQuizzes}
      />
    </PageContainer>
  );
}
