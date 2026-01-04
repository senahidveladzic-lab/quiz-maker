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

interface QuestionCardProps {
  index: number;
  control: Control<any>;
  onRemove: (tempId: string) => void;
  namePrefix: string;
  isCollapsed: boolean;
  onToggleCollapse: (tempId: string) => void;
  tempId: string;
  questionText: string;
  dragHandleProps?: any;
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
}: QuestionCardProps) {
  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 flex items-center justify-between">
            <CardTitle className="text-lg">Question {index + 1}</CardTitle>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onToggleCollapse(tempId)}
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
        <CardContent className="space-y-4 pl-9">
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
