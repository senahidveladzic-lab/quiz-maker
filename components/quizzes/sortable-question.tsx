"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuizQuestion, UseQuizFormReturn } from "@/lib/types";
import { QuestionCard } from "./question-card";

interface SortableQuestionProps {
  question: QuizQuestion;
  index: number;
  control: UseQuizFormReturn["form"]["control"];
  onRemove: (tempId: string) => void;
  onToggleCollapse: (tempId: string) => void;
}

export function SortableQuestion({
  question,
  index,
  control,
  onRemove,
  onToggleCollapse,
}: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.tempId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <QuestionCard
        index={index}
        control={control}
        onRemove={onRemove}
        namePrefix="questions"
        isCollapsed={question.isCollapsed}
        onToggleCollapse={onToggleCollapse}
        tempId={question.tempId}
        questionText={question.text}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
