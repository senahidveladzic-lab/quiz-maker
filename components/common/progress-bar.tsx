"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current?: number;
  total?: number;
  percentage?: number;
  label?: string;
  className?: string;
  labelClassName?: string;
  barClassName?: string;
  fillClassName?: string;
}

export function ProgressBar({
  current,
  total,
  percentage,
  label,
  className,
  labelClassName,
  barClassName,
  fillClassName,
}: ProgressBarProps) {
  const progress =
    percentage ?? (current && total ? (current / total) * 100 : 0);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div
          className={cn(
            "flex justify-between text-sm text-muted-foreground",
            labelClassName,
          )}
        >
          <span>{label}</span>
          {current !== undefined && total !== undefined && (
            <span>
              {current} / {total}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={
          label ||
          (current && total
            ? `Progress: ${current} of ${total}`
            : `Progress: ${progress.toFixed(0)}%`)
        }
        className={cn(
          "w-full bg-secondary rounded-full h-2 overflow-hidden",
          barClassName,
        )}
      >
        <div
          className={cn(
            "bg-primary h-full rounded-full transition-all duration-300",
            fillClassName,
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
