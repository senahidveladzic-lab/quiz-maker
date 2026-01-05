"use client";

import { Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { QuizFormData } from "@/lib/types";
import { useEffect, useRef } from "react";
import { cn, truncateText } from "@/lib/utils";

interface QuestionCardProps {
  index: number;
  control: Control<QuizFormData>;
  onRemove: (tempId: string) => void;
  namePrefix: "questions";
  isCollapsed: boolean;
  onToggleCollapse: (tempId: string) => void;
  tempId: string;
  questionText: string;
  dragHandleProps?: Record<string, any>;
  isNew?: boolean;
}

export function QuestionCard({
  index,
  control,
  onRemove,
  namePrefix,
  isCollapsed,
  onToggleCollapse,
  tempId,
  questionText,
  dragHandleProps,
  isNew = false,
}: QuestionCardProps) {
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const hasError = !!(
    control._formState.errors.questions?.[index]?.text ||
    control._formState.errors.questions?.[index]?.answer
  );
  useEffect(() => {
    if (isNew && !isCollapsed && questionInputRef.current) {
      setTimeout(() => {
        questionInputRef.current?.focus();
      }, 100);
    }
  }, [isNew, isCollapsed]);

  return (
    <Card
      className={cn(
        "border-2",
        hasError && isCollapsed && "border-destructive",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder question"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              {hasError && isCollapsed && (
                <span className="flex h-2 w-2 rounded-full bg-destructive" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onToggleCollapse(tempId)}
                aria-label={
                  isCollapsed ? "Expand question" : "Collapse question"
                }
                aria-expanded={!isCollapsed}
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(tempId)}
                className="text-destructive hover:text-destructive"
                aria-label={`Delete question ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Collapsed Preview */}
        {isCollapsed && (
          <p className="text-sm text-muted-foreground mt-2 pl-7">
            {truncateText(questionText || "Empty question")}
          </p>
        )}
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name={`${namePrefix}.${index}.text`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your question..."
                    className="resize-none"
                    rows={3}
                    {...field}
                    ref={(e) => {
                      field.ref(e);
                      questionInputRef.current = e;
                    }}
                    aria-invalid={
                      !!control._formState.errors.questions?.[index]?.text
                    } // ADD THIS
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`${namePrefix}.${index}.answer`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the answer..."
                    className="resize-none"
                    rows={3}
                    {...field}
                    aria-invalid={
                      !!control._formState.errors.questions?.[index]?.answer
                    } // ADD THIS
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      )}
    </Card>
  );
}
