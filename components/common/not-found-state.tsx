"use client";

import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotFoundStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function NotFoundState({
  title = "Not Found",
  description = "The item you're looking for doesn't exist.",
  actionLabel = "Go Back",
  onAction,
  className,
}: NotFoundStateProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background flex items-center justify-center",
        className,
      )}
    >
      <div className="text-center space-y-4 max-w-md px-4">
        <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground/50" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {onAction && (
          <Button onClick={onAction} size="lg">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
