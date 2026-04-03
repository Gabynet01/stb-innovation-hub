import React, { Fragment } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  className?: string;
  headerClassName?: string;
  cell: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  /** Optional min width for horizontal scroll on small screens */
  minWidthClass?: string;
  /** Extra classes on the `<table>` (e.g. `table-fixed` for column width control). */
  tableClassName?: string;
  /** Lighter chrome for dense / editorial layouts */
  variant?: "default" | "minimal";
  /** Strip outer border/radius for use inside a parent card (e.g. below tabs) */
  flush?: boolean;
  /** Zebra rows (alternating background). Default true. */
  striped?: boolean;
  /**
   * When set, table body scrolls vertically inside this max height and the header stays visible (sticky).
   * Use a Tailwind arbitrary max-height, e.g. `max-h-[min(60vh,560px)]`.
   */
  scrollMaxHeightClass?: string;
  /**
   * Adds a leading expand control and a full-width detail row when open.
   * Pass all three together with `renderExpandedRow`.
   */
  renderExpandedRow?: (row: T) => React.ReactNode;
  isRowExpanded?: (rowKey: string) => boolean;
  onToggleRowExpand?: (rowKey: string) => void;
  getExpandAriaLabel?: (row: T) => string;
}

const cellTypography =
  "text-sm font-normal leading-[130%] tracking-normal text-stanbic-text align-middle";
const headerTypography =
  "text-sm font-medium leading-[130%] tracking-normal text-stanbic-text align-middle";

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "No records to display.",
  minWidthClass = "min-w-[640px]",
  tableClassName = "",
  variant = "default",
  flush = false,
  striped = true,
  scrollMaxHeightClass,
  renderExpandedRow,
  isRowExpanded,
  onToggleRowExpand,
  getExpandAriaLabel,
}: DataTableProps<T>) {
  const isMinimal = variant === "minimal";
  const stickyScroll = Boolean(scrollMaxHeightClass);
  const expandable =
    renderExpandedRow != null &&
    isRowExpanded != null &&
    onToggleRowExpand != null;
  const colCount = columns.length + (expandable ? 1 : 0);

  if (rows.length === 0) {
    return (
      <div
        className={`px-6 py-16 text-center text-sm leading-[130%] text-stanbic-text/70 ${
          isMinimal
            ? "rounded-lg border border-dashed border-stanbic-border bg-white"
            : "rounded-xl border border-dashed border-stanbic-border bg-stanbic-canvas/50"
        }`}
      >
        {emptyMessage}
      </div>
    );
  }

  const headBg = "bg-white";
  const thPad = isMinimal
    ? "px-3 py-3.5 sm:px-4 sm:py-4"
    : "px-4 py-3.5 sm:px-5 sm:py-4";
  const tdPad = isMinimal
    ? "px-3 py-2.5 sm:px-4 sm:py-2.5"
    : "px-4 py-3 sm:px-5 sm:py-3.5";

  return (
    <div
      className={
        flush
          ? `overflow-x-auto bg-white${stickyScroll ? ` ${scrollMaxHeightClass} overflow-y-auto overscroll-contain` : ""}`
          : `overflow-x-auto border border-stanbic-border bg-white ${
              isMinimal ? "rounded-lg shadow-sm" : "rounded-lg shadow-sm"
            }${stickyScroll ? ` ${scrollMaxHeightClass} overflow-y-auto overscroll-contain` : ""}`
      }
    >
      <table
        className={`w-full text-left ${minWidthClass} ${tableClassName}`.trim()}
      >
        <thead
          className={`${headBg} ${
            stickyScroll
              ? "sticky top-0 z-[1] shadow-[0_1px_0_0_#CED3D9]"
              : ""
          }`}
        >
          <tr className={`border-b border-stanbic-border ${headBg}`}>
            {expandable ? (
              <th
                scope="col"
                className={`w-10 px-1.5 ${isMinimal ? "py-3.5 sm:py-4" : "py-3.5 sm:py-4"} ${headerTypography}`}
              >
                <span className="sr-only">Expand row</span>
              </th>
            ) : null}
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className={`${thPad} ${headerTypography} ${
                  isMinimal ? "uppercase tracking-wide" : ""
                } ${col.headerClassName ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={striped ? undefined : "divide-y divide-stanbic-border/80"}
        >
          {rows.map((row, rowIndex) => {
            const rowKey = getRowKey(row);
            const open = expandable && isRowExpanded(rowKey);
            const ariaLabel =
              getExpandAriaLabel?.(row) ?? "Show or hide row details";
            const isOddStripe = rowIndex % 2 === 1;
            const dataRowBg = striped
              ? isOddStripe
                ? "bg-stanbic-canvas"
                : "bg-white"
              : "";
            const dataRowHover = striped
              ? "hover:bg-stanbic-canvas/80"
              : isMinimal
                ? "hover:bg-stanbic-canvas/60"
                : "hover:bg-stanbic-canvas/60";
            const expandedRowBg = striped
              ? isOddStripe
                ? "border-t border-stanbic-border bg-[#E8EAED]"
                : "border-t border-stanbic-border bg-stanbic-canvas/70"
              : "border-t border-stanbic-border bg-stanbic-canvas/50";
            return (
              <Fragment key={rowKey}>
                <tr
                  className={`transition-colors ${dataRowBg} ${dataRowHover}`.trim()}
                >
                  {expandable ? (
                    <td className="w-10 px-1.5 align-middle">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-label={ariaLabel}
                        onClick={() => onToggleRowExpand(rowKey)}
                        className={`flex items-center justify-center rounded-md text-stanbic-text/50 transition-colors hover:bg-stanbic-canvas hover:text-stanbic-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stanbic-secondary ${
                          isMinimal ? "h-8 w-8" : "h-9 w-9 rounded-lg"
                        }`}
                      >
                        <ChevronRightIcon
                          className={`shrink-0 transition-transform duration-200 ${
                            isMinimal ? "h-4 w-4" : "h-5 w-5"
                          } ${open ? "rotate-90 text-stanbic-secondary" : ""}`}
                          aria-hidden
                        />
                      </button>
                    </td>
                  ) : null}
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={`${tdPad} ${cellTypography} ${col.className ?? ""}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
                {open && renderExpandedRow ? (
                  <tr>
                    <td
                      colSpan={colCount}
                      className={`${expandedRowBg} ${
                        isMinimal ? "px-2 py-2 sm:px-3 sm:py-2.5" : "p-3 sm:p-4"
                      }`}
                    >
                      {renderExpandedRow(row)}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
