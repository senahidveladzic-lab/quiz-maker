"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading the data.",
  actionLabel = "Try Again",
  onAction,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="text-center space-y-4 max-w-md px-4">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-destructive">{title}</h3>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
        {onAction && (
          <Button onClick={onAction} variant="outline">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
