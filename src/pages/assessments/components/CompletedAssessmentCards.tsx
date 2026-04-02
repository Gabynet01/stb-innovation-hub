import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import type { Idea } from "@/types/api";
import { RowActionsMenu } from "@/components/ui";
import type { IdeahubIdeaAssessment } from "@/types/ideahub";
import { Pagination } from "@/pages/ideas/components/Pagination";
import { AssessmentListSearch } from "./AssessmentListSearch";
import { priorityPresentation } from "../assessmentPriorityStyles";
import { ASSESSED_PAGE_SIZE } from "../assessmentConstants";

interface CompletedAssessmentCardsProps {
  assessmentsTotal: number;
  filteredAssessed: IdeahubIdeaAssessment[];
  assessedSlice: IdeahubIdeaAssessment[];
  assessedSearch: string;
  onAssessedSearchChange: (v: string) => void;
  assessedPage: number;
  assessedTotalPages: number;
  onAssessedPageChange: (page: number) => void;
  ideaById: Map<string, Idea>;
  onEdit: (a: IdeahubIdeaAssessment) => void;
  onRequestDelete: (id: string) => void;
  /** When true, hide edit/delete (non-admin browse). */
  readOnly?: boolean;
}

export const CompletedAssessmentCards: React.FC<
  CompletedAssessmentCardsProps
> = ({
  assessmentsTotal,
  filteredAssessed,
  assessedSlice,
  assessedSearch,
  onAssessedSearchChange,
  assessedPage,
  assessedTotalPages,
  onAssessedPageChange,
  ideaById,
  onEdit,
  onRequestDelete,
  readOnly = false,
}) => (
  <div className="space-y-4">
    <AssessmentListSearch
      value={assessedSearch}
      onChange={onAssessedSearchChange}
      placeholder="Search by title, reference, idea id, or priority…"
      id="assessments-completed-search"
    />

    {assessmentsTotal === 0 ? (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
        <ClipboardDocumentCheckIcon className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-800">
          No completed assessments yet
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          {readOnly
            ? "Completed scores appear here once an administrator adds them."
            : 'Use the "Awaiting assessment" tab to score your first idea.'}
        </p>
      </div>
    ) : filteredAssessed.length === 0 ? (
      <p className="py-8 text-center text-sm text-slate-500">
        No assessments match your search.
      </p>
    ) : (
      <>
        <ul className="grid gap-4 sm:grid-cols-2">
          {assessedSlice.map((a) => {
            const idea = ideaById.get(String(a.idea_id));
            const title = idea?.title ?? `Idea #${a.idea_id}`;
            const ps = priorityPresentation(a.priority_band);
            return (
              <li
                key={a.id}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:border-[#0051FF]/25 hover:shadow-md"
              >
                <div className="h-0.5 w-full bg-gradient-to-r from-[#0033A1]/80 via-[#0051FF] to-[#50BEFF]/80" />
                <div className="flex flex-1 flex-col p-5 pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Ref. {idea?.reference_number ?? `ID ${a.idea_id}`}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xl font-bold tabular-nums text-[#0033A1]">
                        {a.weighted_score.toFixed(2)}
                      </p>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Score
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${ps.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${ps.dot}`}
                        aria-hidden
                      />
                      {a.priority_band}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(a.updated_at).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                  {a.notes ? (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Analyst notes
                      </p>
                      <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                        {a.notes}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4 border-t border-slate-100 pt-4 text-xs italic text-slate-400">
                      No analyst notes
                    </p>
                  )}
                </div>
                {!readOnly ? (
                  <footer
                    className="mt-auto flex items-center justify-end border-t border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-3 sm:px-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <RowActionsMenu
                      ariaLabel={`Actions for ${title}`}
                      items={[
                        {
                          key: "edit",
                          label: "Edit",
                          onClick: () => onEdit(a),
                        },
                        {
                          key: "delete",
                          label: "Delete",
                          danger: true,
                          onClick: () => onRequestDelete(a.id),
                        },
                      ]}
                    />
                  </footer>
                ) : null}
              </li>
            );
          })}
        </ul>
        {assessedTotalPages > 1 && (
          <Pagination
            currentPage={assessedPage}
            totalPages={assessedTotalPages}
            onPageChange={onAssessedPageChange}
            totalItems={filteredAssessed.length}
            itemsPerPage={ASSESSED_PAGE_SIZE}
          />
        )}
      </>
    )}
  </div>
);
