import React from "react";
import type { PriorityVisual } from "../assessmentPriorityStyles";

interface AssessmentLivePreviewPanelProps {
  previewScore: number;
  previewBand: string;
  previewStyle: PriorityVisual;
  /** Shown under the band on desktop */
  hint?: string;
  className?: string;
}

/**
 * Weighted score + priority band — designed to sit in a sticky column or mobile dock.
 */
export const AssessmentLivePreviewPanel: React.FC<
  AssessmentLivePreviewPanelProps
> = ({
  previewScore,
  previewBand,
  previewStyle,
  hint = "Impact 30% · Feasibility, alignment, market 20% each · Innovation 10%",
  className = "",
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl border border-stanbic-border bg-white shadow-[0_4px_24px_-8px_rgba(34,46,55,0.12)] ring-1 ring-black/[0.03] ${className}`}
  >
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage: `radial-gradient(120% 80% at 100% 0%, rgba(0,81,255,0.12) 0%, transparent 55%),
          radial-gradient(80% 60% at 0% 100%, rgba(0,56,204,0.06) 0%, transparent 45%)`,
      }}
      aria-hidden
    />
    <div className="relative border-b border-white/10 bg-gradient-to-br from-stanbic-primary via-[#0047CC] to-stanbic-secondary px-6 py-6 text-white">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">
        Live preview
      </p>
      <p
        className="mt-3 font-mono text-5xl font-bold tabular-nums tracking-tight sm:text-[3.25rem]"
        aria-live="polite"
        aria-atomic="true"
      >
        {previewScore.toFixed(2)}
      </p>
      <p className="mt-1 text-sm font-medium text-white/85">Weighted score</p>
    </div>
    <div className="relative bg-white px-6 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-stanbic-text/45">
        Priority band
      </p>
      <div className="mt-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold shadow-sm ${previewStyle.badge}`}
        >
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${previewStyle.dot}`}
            aria-hidden
          />
          {previewBand}
        </span>
      </div>
      {hint ? (
        <p className="mt-4 text-xs leading-relaxed text-stanbic-text/55">{hint}</p>
      ) : null}
    </div>
  </div>
);
