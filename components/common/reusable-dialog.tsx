"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReusableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: "default" | "danger";
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
  cancelButtonClassName?: string;
  confirmButtonClassName?: string;
  childrenClassName?: string;
}

export function ReusableDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = "default",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  children,
  isLoading = false,
  contentClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
  cancelButtonClassName,
  confirmButtonClassName,
  childrenClassName,
}: ReusableDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[425px]", contentClassName)}>
        <DialogHeader className={headerClassName}>
          <DialogTitle
            className={cn("flex items-center gap-2", titleClassName)}
          >
            {variant === "danger" && (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className={descriptionClassName}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && (
          <div className={cn("py-4", childrenClassName)}>{children}</div>
        )}

        <DialogFooter className={footerClassName}>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className={cancelButtonClassName}
          >
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant={variant === "danger" ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={isLoading}
              className={confirmButtonClassName}
            >
              {isLoading ? "Loading..." : confirmText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
