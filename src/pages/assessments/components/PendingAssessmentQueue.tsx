import React from "react";
import type { Idea } from "@/types/api";
import { RowActionsMenu } from "@/components/ui";
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
}) => (
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
          is empty. New submissions appear here automatically in the background.
        </p>
      </div>
    ) : filteredPending.length === 0 ? (
      <p className="py-8 text-center text-sm text-slate-500">
        No ideas match your search.
      </p>
    ) : (
      <>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Idea
                </th>
                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:table-cell">
                  Reference
                </th>
                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 md:table-cell">
                  Idea Category
                </th>
                {!readOnly ? (
                  <th
                    scope="col"
                    className="w-14 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {pendingSlice.map((idea) => (
                <tr key={idea.id} className="hover:bg-slate-50/80">
                  <td className="max-w-[220px] px-4 py-3 sm:max-w-none">
                    <p className="font-medium text-slate-900">{idea.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 sm:hidden">
                      {idea.reference_number ?? "—"} · {idea.category_label}
                    </p>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-slate-600 sm:table-cell">
                    {idea.reference_number ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                    {idea.category_label}
                  </td>
                  {!readOnly ? (
                    <td className="w-14 px-4 py-3 text-right align-middle">
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
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pendingTotalPages > 1 && (
          <Pagination
            currentPage={pendingPage}
            totalPages={pendingTotalPages}
            onPageChange={onPendingPageChange}
            totalItems={filteredPending.length}
            itemsPerPage={PENDING_PAGE_SIZE}
          />
        )}
      </>
    )}
  </div>
);
