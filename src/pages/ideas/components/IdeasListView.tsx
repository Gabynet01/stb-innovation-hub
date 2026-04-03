import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { IdeasListToolbar } from "./IdeasListToolbar";
import { IdeasFilters } from "./IdeasFilters";
import { IdeaList, type IdeaListViewMode } from "./IdeaList";
import {
  Button,
  CompactErrorWithToast,
  LoadingSpinner,
  PageHeader,
  SimpleModal,
} from "@/components/ui";
import {
  Idea,
  IdeaFilters,
  DEFAULT_IDEA_FILTERS,
} from "@/types/api";
import type {
  IdeahubIdeaCategory,
  IdeahubIdeaSource,
} from "@/types/ideahub";

export interface IdeasListViewProps {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
  filters: IdeaFilters;
  showFilters: boolean;
  onToggleFilters: () => void;
  onNewIdea: () => void;
  onFiltersChange: (filters: IdeaFilters) => void;
  onClearFilters: () => void;
  onClearError: () => void;
  onView: (idea: Idea) => void;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => Promise<void>;
  sources: IdeahubIdeaSource[];
  categories: IdeahubIdeaCategory[];
}

const IdeasListViewComponent: React.FC<IdeasListViewProps> = ({
  ideas,
  loading,
  error,
  filters,
  showFilters,
  onToggleFilters,
  onNewIdea,
  onFiltersChange,
  onClearFilters,
  onClearError,
  onView,
  onEdit,
  onDelete,
  sources,
  categories,
}) => {
  const [viewMode, setViewMode] = useState<IdeaListViewMode>(() => {
    try {
      const v = localStorage.getItem("ideas-view-mode");
      return v === "table" ? "table" : "grid";
    } catch {
      return "grid";
    }
  });

  const handleViewModeChange = useCallback((mode: IdeaListViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem("ideas-view-mode", mode);
    } catch {
      /* ignore */
    }
  }, []);

  /** Draft filters while the modal is open; committed to parent on Done (triggers IdeaHub GET with query params). */
  const [draftFilters, setDraftFilters] = useState<IdeaFilters>(filters);
  const prevShowFilters = useRef(false);

  useEffect(() => {
    const opened = showFilters && !prevShowFilters.current;
    prevShowFilters.current = showFilters;
    if (opened) {
      setDraftFilters({ ...filters });
    }
  }, [showFilters, filters]);

  const applyDraftAndClose = useCallback(() => {
    onFiltersChange(draftFilters);
    onToggleFilters();
  }, [draftFilters, onFiltersChange, onToggleFilters]);

  const clearFiltersDraftAndCommit = useCallback(() => {
    setDraftFilters({ ...DEFAULT_IDEA_FILTERS });
    onClearFilters();
  }, [onClearFilters]);

  const emptyDueToFilters =
    ideas.length === 0 &&
    Boolean(
      filters.search ||
        filters.status ||
        filters.ideahub_status ||
        filters.category_id ||
        filters.source_id ||
        filters.author_type
    );

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status ||
      filters.ideahub_status ||
      filters.category_id ||
      filters.source_id ||
      filters.author_type
  );

  const closeFiltersModal = () => {
    if (showFilters) onToggleFilters();
  };

  return (
    <div className="min-h-screen bg-stanbic-canvas ideas-container">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Idea Bank" },
        ]}
        title="Idea Bank"
        description="Capture and track ideas across the organisation — from concept to user stories and pipeline stages."
        actions={
          <IdeasListToolbar
            showFilters={showFilters}
            onToggleFilters={onToggleFilters}
            onNewIdea={onNewIdea}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            filtersActive={hasActiveFilters}
          />
        }
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8 sm:px-6">
        <SimpleModal
          isOpen={showFilters}
          onClose={closeFiltersModal}
          title="Filter ideas"
          size="xl"
          footer={
            <>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFiltersDraftAndCommit}>
                  Clear all
                </Button>
              )}
              <Button
                variant="primary"
                onClick={applyDraftAndClose}
                className="!bg-[#0051FF] hover:!bg-[#0033A1]"
              >
                Apply filters
              </Button>
            </>
          }
        >
          <p className="mb-4 text-sm text-slate-500">
            Filters use IdeaHub query parameters (source, category, author type,
            workflow status). Click <strong className="text-slate-700">Apply filters</strong>{" "}
            to load matching ideas from the server. Search narrows the loaded results
            in your browser.
          </p>
          <IdeasFilters
            embedded
            filters={draftFilters}
            onFiltersChange={setDraftFilters}
            onClearFilters={clearFiltersDraftAndCommit}
            sources={sources}
            categories={categories}
          />
        </SimpleModal>

        {error && (
          <div className="mb-6">
            <CompactErrorWithToast
              error={error}
              title="Could not load ideas"
              onRetry={onClearError}
            />
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <LoadingSpinner size="md" color="primary" />
            <p className="mt-4 text-sm font-medium text-[#0033A1]/80">
              Loading ideas…
            </p>
          </div>
        ) : (
          <div>
            <IdeaList
              ideas={ideas}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              viewMode={viewMode}
              emptyDueToFilters={emptyDueToFilters}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const IdeasListView = memo(IdeasListViewComponent);
