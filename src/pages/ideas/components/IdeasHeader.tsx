import React from "react";
import {
  FunnelIcon,
  PlusIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import type { IdeaListViewMode } from "./IdeaList";
import {
  PAGE_HERO_HEADER_CLASS,
  PAGE_HERO_PATTERN_LIGHT,
  PAGE_HERO_SURFACE,
} from "@/constants/pageHero";

interface IdeasHeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onNewIdea: () => void;
  viewMode?: IdeaListViewMode;
  onViewModeChange?: (mode: IdeaListViewMode) => void;
  /** Show indicator when filters are applied (modal closed). */
  filtersActive?: boolean;
}

export const IdeasHeader: React.FC<IdeasHeaderProps> = ({
  showFilters,
  onToggleFilters,
  onNewIdea,
  viewMode = "grid",
  onViewModeChange,
  filtersActive = false,
}) => {
  return (
    <header className={PAGE_HERO_HEADER_CLASS}>
      <div className={PAGE_HERO_SURFACE} aria-hidden />
      <div
        className="absolute inset-0 opacity-80"
        style={{ backgroundImage: PAGE_HERO_PATTERN_LIGHT }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-11">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Stanbic Bank · Innovation
            </p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Idea Bank
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                Capture and track ideas across the organisation — from concept
                to user stories and pipeline stages.
              </p>
            </div>
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center gap-2 lg:justify-end">
            <button
              type="button"
              onClick={onToggleFilters}
              className="relative inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              title={showFilters ? "Close filters" : "Open filters"}
            >
              <FunnelIcon className="h-4 w-4 text-slate-500" />
              <span className="hidden sm:inline">
                {showFilters ? "Close" : "Filters"}
              </span>
              {filtersActive && !showFilters && (
                <span
                  className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#0051FF]"
                  aria-hidden
                />
              )}
            </button>

            {onViewModeChange && (
              <div
                className="flex rounded-lg border border-slate-200 bg-slate-100/90 p-0.5 shadow-sm"
                role="group"
                aria-label="Layout"
              >
                <button
                  type="button"
                  onClick={() => onViewModeChange("grid")}
                  title="Cards"
                  className={`rounded-md px-2.5 py-2 transition ${
                    viewMode === "grid"
                      ? "bg-white text-[#0051FF] shadow-md"
                      : "text-slate-600 hover:bg-white/90"
                  }`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange("table")}
                  title="Table"
                  className={`rounded-md px-2.5 py-2 transition ${
                    viewMode === "table"
                      ? "bg-white text-[#0051FF] shadow-md"
                      : "text-slate-600 hover:bg-white/90"
                  }`}
                >
                  <TableCellsIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onNewIdea}
              className="inline-flex h-10 items-center rounded-lg bg-gradient-to-br from-[#0051FF] to-[#0038CC] px-4 text-sm font-semibold text-white shadow-md transition hover:from-[#0047E6] hover:to-[#0033A1]"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              New idea
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
