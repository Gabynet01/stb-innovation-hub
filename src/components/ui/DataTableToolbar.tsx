import React from "react";

export interface DataTableToolbarProps {
  /** Total row count (e.g. before client filter use full count). */
  total: number;
  /** Noun after count, plural (e.g. "records", "documents"). */
  totalLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Toolbar above a data table: left count, right actions (filter, export, etc.).
 */
export function DataTableToolbar({
  total,
  totalLabel = "records",
  className = "",
  children,
}: DataTableToolbarProps) {
  const singular =
    totalLabel.endsWith("s") && total === 1
      ? totalLabel.slice(0, -1)
      : totalLabel;

  return (
    <div
      className={`mb-5 flex flex-col gap-3 border-b border-stanbic-border pb-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="text-sm font-normal leading-[130%] text-stanbic-text/70">
        <span className="font-medium tabular-nums text-stanbic-text">
          {total}
        </span>{" "}
        {total === 1 ? singular : totalLabel} in total
      </p>
      {children ? (
        <div className="flex flex-wrap items-center gap-4">{children}</div>
      ) : null}
    </div>
  );
}
