"use client";

import { Trash2, Pencil } from "lucide-react";
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
  onRemove: (index: number) => void;
  namePrefix: string;
  isExistingQuestion?: boolean;
  onEditExisting?: () => void;
}

export function QuestionCard({
  index,
  control,
  onRemove,
  namePrefix,
  isExistingQuestion = false,
  onEditExisting,
}: QuestionCardProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Question {index + 1}
            {isExistingQuestion && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                (Existing)
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {isExistingQuestion && onEditExisting && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onEditExisting}
                title="Edit question"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="text-destructive hover:text-destructive"
              title="Remove question"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
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
    </Card>
  );
}
