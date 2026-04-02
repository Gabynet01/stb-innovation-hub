import React from "react";
import type { PriorityVisual } from "../assessmentPriorityStyles";
import { AssessmentStickyPreview } from "./AssessmentStickyPreview";

interface AssessmentPreviewSidebarProps {
  previewScore: number;
  previewBand: string;
  previewStyle: PriorityVisual;
}

function AssessmentWorkflowHints() {
  return (
    <div className="rounded-xl border border-dashed border-[#0051FF]/30 bg-gradient-to-br from-[#F0F7FF] to-white px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold text-[#0033A1]">Workflow</p>
      <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-slate-600">
        <li className="flex gap-2">
          <span className="font-semibold text-[#0051FF]">New</span>
          <span>Pick an idea from Awaiting, then score below.</span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold text-[#0051FF]">Edit</span>
          <span>Open Completed and choose Edit on a card.</span>
        </li>
      </ul>
    </div>
  );
}

/** Full assessments page: sticky live preview + workflow hints (desktop); fixed dock (mobile). */
export const AssessmentPreviewSidebar: React.FC<
  AssessmentPreviewSidebarProps
> = (props) => (
  <AssessmentStickyPreview
    {...props}
    desktopFooter={<AssessmentWorkflowHints />}
  />
);
