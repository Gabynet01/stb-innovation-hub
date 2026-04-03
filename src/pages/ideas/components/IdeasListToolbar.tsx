import React from "react";
import {
  FunnelIcon,
  PlusIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";
import type { IdeaListViewMode } from "./IdeaList";

interface IdeasListToolbarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onNewIdea: () => void;
  viewMode?: IdeaListViewMode;
  onViewModeChange?: (mode: IdeaListViewMode) => void;
  filtersActive?: boolean;
}

export const IdeasListToolbar: React.FC<IdeasListToolbarProps> = ({
  showFilters,
  onToggleFilters,
  onNewIdea,
  viewMode = "grid",
  onViewModeChange,
  filtersActive = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onToggleFilters}
        className="relative inline-flex h-10 items-center gap-2 rounded-md border border-stanbic-border bg-white px-3.5 text-sm font-medium text-stanbic-text shadow-sm transition-colors hover:bg-stanbic-canvas"
        title={showFilters ? "Close filters" : "Open filters"}
      >
        <FunnelIcon className="h-4 w-4 text-stanbic-text/60" />
        <span className="hidden sm:inline">
          {showFilters ? "Close" : "Filters"}
        </span>
        {filtersActive && !showFilters && (
          <span
            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-stanbic-secondary"
            aria-hidden
          />
        )}
      </button>

      {onViewModeChange && (
        <div
          className="flex rounded-md border border-stanbic-border bg-stanbic-canvas p-0.5 shadow-sm"
          role="group"
          aria-label="Layout"
        >
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            title="Cards"
            className={`rounded px-2.5 py-2 transition ${
              viewMode === "grid"
                ? "bg-stanbic-secondary text-white shadow-sm"
                : "bg-white text-stanbic-text hover:bg-white"
            }`}
          >
            <Squares2X2Icon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            title="Table"
            className={`rounded px-2.5 py-2 transition ${
              viewMode === "table"
                ? "bg-stanbic-secondary text-white shadow-sm"
                : "bg-white text-stanbic-text hover:bg-white"
            }`}
          >
            <TableCellsIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <Button variant="primary" size="sm" onClick={onNewIdea} className="!scale-100">
        <PlusIcon className="mr-2 h-4 w-4" />
        New idea
      </Button>
    </div>
  );
};
