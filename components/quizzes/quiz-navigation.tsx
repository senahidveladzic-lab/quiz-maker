"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface QuizNavigationProps {
  visible: boolean;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
}

export function QuizNavigation({
  visible,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
}: QuizNavigationProps) {
  return (
    <AnimatePresence>
      {visible && (
        <m.nav
          aria-label="Quiz navigation"
          className="flex items-center justify-between gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="gap-2"
            aria-label="Previous question"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </Button>

          {!isLastQuestion && (
            <>
              <div
                className="text-xs text-muted-foreground text-center"
                aria-hidden="true"
              >
                Swipe / Arrow keys
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={onNext}
                disabled={!canGoNext}
                className="gap-2"
                aria-label="Next question"
              >
                Next
                <ArrowRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {isLastQuestion && <div className="flex-1" aria-hidden="true" />}
        </m.nav>
      )}
    </AnimatePresence>
  );
}
