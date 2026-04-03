import React from "react";

export type StatusDotTone = "pending" | "success" | "danger" | "neutral";

const toneClass: Record<
  StatusDotTone,
  { dot: string; wrap: string; label: string }
> = {
  pending: {
    dot: "bg-stanbic-secondary",
    wrap: "bg-sky-50",
    label: "text-stanbic-primary",
  },
  success: {
    dot: "bg-emerald-600",
    wrap: "bg-emerald-50",
    label: "text-emerald-800",
  },
  danger: {
    dot: "bg-red-600",
    wrap: "bg-red-50",
    label: "text-red-800",
  },
  neutral: {
    dot: "bg-stanbic-text/45",
    wrap: "bg-stanbic-canvas",
    label: "text-stanbic-text",
  },
};

/** Map free-text statuses (pipeline, generation, etc.) to badge tone */
export function statusToneFromString(raw: string): StatusDotTone {
  const s = raw.toLowerCase();
  if (
    s.includes("pending") ||
    s.includes("progress") ||
    s.includes("queued") ||
    s === "new"
  ) {
    return "pending";
  }
  if (
    s.includes("fail") ||
    s.includes("reject") ||
    s.includes("error") ||
    s.includes("cancel")
  ) {
    return "danger";
  }
  if (
    s.includes("complete") ||
    s.includes("success") ||
    s.includes("approv") ||
    s.includes("processed") ||
    s.includes("done")
  ) {
    return "success";
  }
  return "neutral";
}

export interface StatusDotBadgeProps {
  label: string;
  tone?: StatusDotTone;
  className?: string;
}

/**
 * Pill badge with leading coloured dot (Stanbic data-table pattern).
 */
export function StatusDotBadge({
  label,
  tone = "neutral",
  className = "",
}: StatusDotBadgeProps) {
  const t = toneClass[tone];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium leading-[130%] ${t.wrap} ${t.label} ${className}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${t.dot}`}
        aria-hidden
      />
      {label}
    </span>
  );
}
