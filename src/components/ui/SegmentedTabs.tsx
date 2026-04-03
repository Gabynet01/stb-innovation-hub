import React from "react";

export interface SegmentedTabItem<T extends string = string> {
  id: T;
  label: string;
  /** Optional count badge (e.g. list length per tab). */
  count?: number;
}

export type SegmentedTabsVariant = "underline" | "filled";

export interface SegmentedTabsProps<T extends string = string> {
  items: SegmentedTabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  /**
   * `underline` — primary blue + bottom bar (many tabs, filters).
   * `filled` — secondary blue fill on selected, white on rest (toggle group).
   */
  variant?: SegmentedTabsVariant;
  /** When true, tabs stay on one row with horizontal scroll (many tabs, e.g. idea categories). */
  nowrap?: boolean;
  /** Set to the `id` of the associated `role="tabpanel"` element for accessibility. */
  panelId?: string;
  "aria-label"?: string;
}

export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  className = "",
  variant = "underline",
  nowrap = false,
  panelId,
  "aria-label": ariaLabel,
}: SegmentedTabsProps<T>) {
  if (variant === "filled") {
    const scroll = nowrap
      ? "flex-nowrap overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]"
      : "flex-wrap";
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`w-full rounded-md border border-stanbic-border bg-stanbic-canvas p-0.5 ${className}`}
      >
        <div className={`flex min-h-[2.75rem] gap-0.5 ${scroll}`}>
          {items.map((item) => {
            const selected = value === item.id;
            const hasCount = item.count !== undefined;
            const widthGrow = nowrap
              ? "shrink-0 grow-0"
              : "min-w-[8rem] flex-1";
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`segmented-tab-${String(item.id)}`}
                aria-selected={selected}
                {...(panelId ? { "aria-controls": panelId } : {})}
                onClick={() => onChange(item.id)}
                className={`inline-flex min-h-[2.5rem] items-center justify-center gap-1.5 rounded px-3 py-2 text-center text-sm font-medium leading-[130%] tracking-normal transition-colors sm:px-4 ${widthGrow} ${
                  nowrap ? "min-w-[8rem]" : ""
                } ${
                  selected
                    ? "bg-stanbic-secondary text-white shadow-sm"
                    : "bg-white text-stanbic-text hover:bg-white"
                }`}
              >
                <span className="truncate">{item.label}</span>
                {hasCount ? (
                  <span
                    className={`shrink-0 tabular-nums text-xs font-medium ${
                      selected ? "text-white/90" : "text-stanbic-text/50"
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
      </div>
    );
  }

  const scroll = nowrap
    ? "flex-nowrap overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]"
    : "flex-wrap";

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`w-full bg-white ${className}`}
    >
      <div
        className={`flex min-h-[3rem] gap-0 border-b border-stanbic-border ${scroll}`}
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
              className={`relative inline-flex min-h-[3rem] max-w-[min(100%,320px)] shrink-0 justify-center px-4 text-center text-sm font-medium leading-[130%] tracking-normal transition-colors sm:px-5 ${
                selected
                  ? "items-end pb-2 pt-3 text-stanbic-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-sm after:bg-stanbic-primary sm:after:inset-x-4"
                  : "items-center py-3 text-stanbic-text/55 hover:text-stanbic-text"
              }`}
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <span className="truncate">{item.label}</span>
                {hasCount ? (
                  <span
                    className={`shrink-0 tabular-nums text-xs font-medium ${
                      selected
                        ? "text-stanbic-secondary"
                        : "text-stanbic-text/45"
                    }`}
                    aria-label={`${item.count} items`}
                  >
                    {item.count}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
