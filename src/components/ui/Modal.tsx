"use client";

import React from "react";
import { Button } from "./index";
import { cn } from "@/lib/utils";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      onConfirm,
      confirmText = "Confirm",
      cancelText = "Cancel",
      isDangerous = false,
      isLoading = false,
      className,
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
          className
        )}
        onClick={handleBackdropClick}
        {...props}
      >
        <div className="mx-4 w-full max-w-md rounded-2xl bg-surface border border-border/70 p-6 shadow-none">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-muted">{description}</p>
          )}

          <div className="mt-6 flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={isDangerous ? "primary" : "primary"}
              onClick={onConfirm}
              disabled={isLoading}
              className={isDangerous ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {isLoading ? "Loading..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
Modal.displayName = "Modal";
