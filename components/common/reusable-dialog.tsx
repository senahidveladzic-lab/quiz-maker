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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {variant === "danger" && (
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        )}
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                {children && <div className="py-4">{children}</div>}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    {onConfirm && (
                        <Button
                            variant={variant === "danger" ? "destructive" : "default"}
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : confirmText}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}