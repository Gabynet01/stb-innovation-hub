import React, { useMemo } from "react";
import type { Idea } from "@/types/api";
import { FunnelIcon } from "@heroicons/react/24/outline";
import {
  DataTable,
  DataTableToolbar,
  RowActionsMenu,
  type DataTableColumn,
} from "@/components/ui";
import { Pagination } from "@/pages/ideas/components/Pagination";
import { AssessmentListSearch } from "./AssessmentListSearch";
import { PENDING_PAGE_SIZE } from "../assessmentConstants";

interface PendingAssessmentQueueProps {
  pendingIdeas: Idea[];
  filteredPending: Idea[];
  pendingSlice: Idea[];
  pendingSearch: string;
  onPendingSearchChange: (v: string) => void;
  pendingPage: number;
  pendingTotalPages: number;
  onPendingPageChange: (page: number) => void;
  onAssessIdea: (idea: Idea) => void;
  /** When true, hide scoring actions (non-admin browse). */
  readOnly?: boolean;
}

export const PendingAssessmentQueue: React.FC<PendingAssessmentQueueProps> = ({
  pendingIdeas,
  filteredPending,
  pendingSlice,
  pendingSearch,
  onPendingSearchChange,
  pendingPage,
  pendingTotalPages,
  onPendingPageChange,
  onAssessIdea,
  readOnly = false,
}) => {
  const columns: DataTableColumn<Idea>[] = useMemo(() => {
    const cols: DataTableColumn<Idea>[] = [
      {
        id: "idea",
        header: "Idea",
        cell: (idea) => (
          <>
            <p className="font-medium text-stanbic-text">{idea.title}</p>
            <p className="mt-0.5 text-xs text-stanbic-text/60 sm:hidden">
              {idea.reference_number ?? "—"} · {idea.category_label}
            </p>
          </>
        ),
      },
      {
        id: "reference",
        header: "Reference",
        headerClassName: "hidden sm:table-cell",
        className: "hidden whitespace-nowrap text-stanbic-text/80 sm:table-cell",
        cell: (idea) => idea.reference_number ?? "—",
      },
      {
        id: "category",
        header: "Idea Category",
        headerClassName: "hidden md:table-cell",
        className: "hidden text-stanbic-text/80 md:table-cell",
        cell: (idea) => idea.category_label,
      },
    ];
    if (!readOnly) {
      cols.push({
        id: "actions",
        header: <span className="sr-only">Actions</span>,
        headerClassName: "w-14 text-right",
        className: "w-14 text-right align-middle",
        cell: (idea) => (
          <div className="flex justify-end">
            <RowActionsMenu
              ariaLabel={`Actions for ${idea.title}`}
              items={[
                {
                  key: "assess",
                  label: "Assess",
                  onClick: () => onAssessIdea(idea),
                },
              ]}
            />
          </div>
        ),
      });
    }
    return cols;
  }, [readOnly, onAssessIdea]);

  return (
    <div className="space-y-4">
      <AssessmentListSearch
        value={pendingSearch}
        onChange={onPendingSearchChange}
        placeholder="Search by title, reference, idea category, or source…"
        id="assessments-pending-search"
      />

      {pendingIdeas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-800">
            No ideas waiting for an assessment
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Every idea in the loaded bank already has a score, or the idea list
            is empty. New submissions appear here automatically in the
            background.
          </p>
        </div>
      ) : filteredPending.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No ideas match your search.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-stanbic-border bg-white">
            <div className="border-b border-stanbic-border px-4 py-3 sm:px-5">
              <DataTableToolbar total={filteredPending.length} totalLabel="ideas">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("assessments-pending-search")?.focus()
                  }
                  className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-stanbic-secondary transition hover:text-stanbic-primary"
                >
                  <FunnelIcon className="h-4 w-4 shrink-0" aria-hidden />
                  Filter
                </button>
              </DataTableToolbar>
            </div>
            <DataTable
              flush
              columns={columns}
              rows={pendingSlice}
              getRowKey={(i) => i.id}
              minWidthClass="min-w-[560px]"
              emptyMessage="No ideas on this page."
            />
          </div>
          {pendingTotalPages > 1 && (
            <Pagination
              currentPage={pendingPage}
              totalPages={pendingTotalPages}
              onPageChange={onPendingPageChange}
              totalItems={filteredPending.length}
              itemsPerPage={PENDING_PAGE_SIZE}
              variant="stanbic"
              itemLabel="ideas"
            />
          )}
        </>
      )}
    </div>
  );
};
