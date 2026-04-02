import React from "react";

export interface SegmentedTabItem<T extends string = string> {
  id: T;
  label: string;
  /** Optional count badge (e.g. list length per tab). */
  count?: number;
}

export interface SegmentedTabsProps<T extends string = string> {
  items: SegmentedTabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  /** When true, tabs stay on one row with horizontal scroll (many tabs, e.g. idea categories). */
  nowrap?: boolean;
  /** Set to the `id` of the associated `role="tabpanel"` element for accessibility. */
  panelId?: string;
  "aria-label"?: string;
}

/**
 * Pill-style section tabs (same pattern as Administration).
 */
export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  className = "",
  nowrap = false,
  panelId,
  "aria-label": ariaLabel,
}: SegmentedTabsProps<T>) {
  const flow = nowrap
    ? "flex-nowrap overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]"
    : "flex-wrap";

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm ${flow} ${className}`}
    >
      {items.map((item) => {
        const selected = value === item.id;
        const hasCount = item.count !== undefined;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`segmented-tab-${String(item.id)}`}
            aria-selected={selected}
            {...(panelId ? { "aria-controls": panelId } : {})}
            onClick={() => onChange(item.id)}
            className={`inline-flex max-w-[min(100%,280px)] shrink-0 items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition ${selected
                ? "border-[#0051FF] bg-[#F0F7FF] text-slate-900 shadow-sm"
                : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
              }`}
          >
            <span className="min-w-0 truncate text-left">{item.label}</span>
            {hasCount ? (
              <span
                className={`inline-flex min-h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-md px-2 text-[11px] font-bold tabular-nums leading-none ${selected
                    ? "bg-[#0051FF]/15 text-[#0033A1]"
                    : "border border-slate-200/90 bg-slate-100 text-slate-700"
                  }`}
                aria-label={`${item.count} items`}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
