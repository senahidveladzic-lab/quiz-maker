"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({
  children,
  className,
  noPadding = false,
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      <div
        className={cn(
          "container mx-auto",
          !noPadding && "py-10 px-4",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
