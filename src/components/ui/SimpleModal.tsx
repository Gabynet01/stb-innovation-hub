import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Wider modals for forms */
  size?: "md" | "lg" | "xl";
}

export const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxW =
    size === "xl" ? "max-w-3xl" : size === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <button
          type="button"
          aria-label="Close dialog"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          className={`relative flex max-h-[min(90vh,880px)] w-full flex-col transform overflow-hidden rounded-lg border border-stanbic-border bg-white text-left text-stanbic-text shadow-2xl transition-all sm:my-8 ${maxW}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="simple-modal-title"
        >
          <div className="flex shrink-0 items-center justify-between bg-stanbic-primary px-6 py-4">
            <h2
              id="simple-modal-title"
              className="text-base font-medium leading-[130%] text-white"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-md p-1 text-white transition hover:bg-white/15"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 text-sm font-normal leading-[130%]">
            {children}
          </div>
          {footer && (
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-stanbic-border bg-stanbic-canvas px-6 py-4 sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
