import React from "react";

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
  /** Lighter chrome for dense / editorial layouts */
  variant?: "default" | "minimal";
  /** Strip outer border/radius for use inside a parent card (e.g. below tabs) */
  flush?: boolean;
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "No records to display.",
  minWidthClass = "min-w-[640px]",
  variant = "default",
  flush = false,
}: DataTableProps<T>) {
  const isMinimal = variant === "minimal";

  if (rows.length === 0) {
    return (
      <div
        className={`px-6 py-16 text-center text-sm text-slate-500 ${
          isMinimal
            ? "rounded-lg border border-dashed border-slate-200 bg-white"
            : "rounded-xl border border-slate-200 bg-slate-50/80"
        }`}
      >
        {emptyMessage}
      </div>
    );
  }

  const headBg = isMinimal ? "bg-slate-50" : "bg-slate-50";

  return (
    <div
      className={
        flush
          ? "overflow-x-auto bg-white"
          : `overflow-x-auto border border-slate-200 bg-white ${
              isMinimal ? "rounded-lg shadow-sm" : "rounded-xl shadow-sm"
            }`
      }
    >
      <table className={`w-full text-left text-sm ${minWidthClass}`}>
        <thead>
          <tr className={`border-b border-slate-200 ${headBg}`}>
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className={`px-5 py-4 sm:px-6 sm:py-4 ${
                  isMinimal
                    ? "text-xs font-semibold uppercase tracking-wider text-slate-800"
                    : "font-semibold text-slate-700"
                } ${col.headerClassName ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className={
                isMinimal
                  ? "transition-colors hover:bg-slate-50/70"
                  : "transition-colors hover:bg-slate-50/80"
              }
            >
              {columns.map((col) => (
                <td
                  key={col.id}
                  className={`px-5 py-4 align-middle text-slate-800 sm:px-6 sm:py-[1.125rem] ${col.className ?? ""}`}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
