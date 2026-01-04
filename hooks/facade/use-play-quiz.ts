"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/api/quiz-api";
import { Quiz, Question } from "@/lib/types";
import { toast } from "sonner";

export interface UsePlayQuizReturn {
  quiz: Quiz | undefined;
  isLoading: boolean;
  questions: Question[];
  currentQuestion: Question | undefined;
  totalQuestions: number;
  currentIndex: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  progressPercentage: number;
  showEndMessage: boolean;

  revealedAnswers: Set<number>;
  isAnswerRevealed: boolean;

  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };

  handlePrevious: () => void;
  handleNext: () => void;
  handleRevealAnswer: () => void;
  handleBackToQuizzes: () => void;
  handleShare: () => void;
}

export function usePlayQuiz(quizId: string): UsePlayQuizReturn {
  const router = useRouter();
  const { data: quiz, isLoading } = useQuiz(quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(
    new Set(),
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const questions: Question[] = quiz?.questions || [];
  const currentQuestion: Question | undefined = questions[currentIndex];
  const totalQuestions: number = questions.length;
  const isAnswerRevealed: boolean = revealedAnswers.has(currentIndex);

  const canGoPrevious: boolean = currentIndex > 0;
  const isLastQuestion: boolean = currentIndex === totalQuestions - 1;

  const canGoNext: boolean = isAnswerRevealed && !isLastQuestion;

  const showEndMessage: boolean = isLastQuestion && isAnswerRevealed;

  const progressPercentage: number =
    totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const handlePrevious = (): void => {
    if (canGoPrevious) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = (): void => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRevealAnswer = (): void => {
    setRevealedAnswers(new Set([...revealedAnswers, currentIndex]));
  };

  const handleBackToQuizzes = (): void => {
    router.push("/");
  };

  const handleShare = async (): Promise<void> => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: quiz?.name || "Quiz",
          text: `Check out this quiz: ${quiz?.name}`,
          url: url,
        });
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link");
        console.error("Share error:", error);
      }
    }
  };

  const onTouchStart = (e: React.TouchEvent): void => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (): void => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Only allow swipe to next if answer is revealed
    if (isLeftSwipe && canGoNext) {
      handleNext();
    }
    if (isRightSwipe && canGoPrevious) {
      handlePrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft" && canGoPrevious) {
        handlePrevious();
      } else if (e.key === "ArrowRight" && canGoNext) {
        handleNext();
      } else if (e.key === " " && !isAnswerRevealed) {
        e.preventDefault();
        handleRevealAnswer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentIndex,
    totalQuestions,
    isAnswerRevealed,
    canGoNext,
    canGoPrevious,
  ]);

  return {
    quiz,
    isLoading,
    questions,
    currentQuestion,
    totalQuestions,

    currentIndex,
    canGoPrevious,
    canGoNext,
    isLastQuestion,
    progressPercentage,
    showEndMessage,

    revealedAnswers,
    isAnswerRevealed,

    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },

    handlePrevious,
    handleNext,
    handleRevealAnswer,
    handleBackToQuizzes,
    handleShare,
  };
}
