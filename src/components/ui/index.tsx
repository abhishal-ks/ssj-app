"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-semibold tracking-[0.01em] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-accent to-accent-strong text-foreground shadow-[0_18px_45px_rgba(79,70,229,0.18)] hover:brightness-120",
      secondary:
        "border border-border/80 bg-surface/90 text-foreground hover:bg-surface-strong",
      ghost: "bg-transparent text-foreground hover:bg-surface-strong",
    };

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-5 py-3 text-base",
      lg: "px-6 py-3.5 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-surface/95",
      muted: "bg-surface-muted/85",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[28px] border border-border/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-[18px] border border-border/80 bg-surface/90 px-4 py-3 text-foreground placeholder:text-muted transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-[22px] border border-border/80 bg-surface/90 px-4 py-4 text-foreground placeholder:text-muted transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "muted" | "accent" | "success" | "warning" | "error";
}

export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ className, color = "muted", ...props }, ref) => {
    const colorStyles = {
      muted: "border-border/60 bg-surface/80 text-muted",
      accent: "border-accent/20 bg-accent/10 text-accent",
      success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
      warning: "border-amber-500/20 bg-amber-500/10 text-amber-600",
      error: "border-red-500/20 bg-red-500/10 text-red-600",
    };

    return (
      <span
        ref={ref}
        className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", colorStyles[color], className)}
        {...props}
      />
    );
  }
);
StatusPill.displayName = "StatusPill";

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> { }

export const PageShell = React.forwardRef<HTMLDivElement, PageShellProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative min-h-screen overflow-hidden bg-transparent px-4 py-8 text-foreground sm:px-6 lg:px-10", className)}
        {...props}
      />
    );
  }
);
PageShell.displayName = "PageShell";

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
        className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm", className)}
        onClick={handleBackdropClick}
        {...props}
      >
        <div className="mx-4 w-full max-w-md rounded-[28px] border border-border/70 bg-surface/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.24)]">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-3 text-sm leading-6 text-muted">{description}</p>}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button variant="primary" onClick={onConfirm} disabled={isLoading} className={isDangerous ? "bg-red-600 hover:bg-red-700" : ""}>
              {isLoading ? "Loading..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
Modal.displayName = "Modal";
