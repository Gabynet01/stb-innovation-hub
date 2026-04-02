import React from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";

interface AssessmentEditorBannerProps {
  isEditing: boolean;
  ideaTitle: string;
  onClose: () => void;
  saving: boolean;
}

export const AssessmentEditorBanner: React.FC<AssessmentEditorBannerProps> = ({
  isEditing,
  ideaTitle,
  onClose,
  saving,
}) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#0051FF]/25 bg-[#F0F7FF] px-4 py-3 sm:px-5">
    <div className="flex min-w-0 items-center gap-2">
      <ChartBarIcon className="h-5 w-5 shrink-0 text-[#0051FF]" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0033A1]/80">
          {isEditing ? "Editing assessment" : "New assessment"}
        </p>
        <p className="truncate text-sm font-semibold text-slate-900">
          {ideaTitle}
        </p>
      </div>
    </div>
    <Button
      variant="ghost"
      onClick={onClose}
      disabled={saving}
      className="shrink-0 text-slate-600"
    >
      Close editor
    </Button>
  </div>
);
