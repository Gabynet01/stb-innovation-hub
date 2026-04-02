import React from "react";
import { Button, Input, Select } from "@/components/ui";
import type { IdeaFilters } from "@/types/api";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type {
  IdeahubIdeaCategory,
  IdeahubIdeaSource,
} from "@/types/ideahub";

interface IdeasFiltersProps {
  filters: IdeaFilters;
  onFiltersChange: (filters: IdeaFilters) => void;
  onClearFilters: () => void;
  sources: IdeahubIdeaSource[];
  categories: IdeahubIdeaCategory[];
  /** When true, plain layout for use inside a dialog (no outer card / title row). */
  embedded?: boolean;
}

const IDEAHUB_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All stages" },
  { value: "draft", label: "Draft" },
  { value: "under_review", label: "Under review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "implemented", label: "Implemented" },
];

const labelCls =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#0033A1]/70";

export const IdeasFilters: React.FC<IdeasFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  sources,
  categories,
  embedded = false,
}) => {
  const handleFilterChange = (field: keyof IdeaFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status ||
      filters.ideahub_status ||
      filters.category_id ||
      filters.source_id ||
      filters.author_type
  );

  const sortedCategories = [...categories].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const header = !embedded && (
    <div className="mb-5 flex items-center justify-between gap-3 border-l-4 border-l-[#0051FF] pl-4">
      <div>
        <h3 className="text-sm font-semibold text-[#0033A1]">Refine list</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Filter by stage, source, and category
        </p>
      </div>
      {hasActiveFilters && (
        <Button
          onClick={onClearFilters}
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 text-[#0051FF] hover:bg-[#0051FF]/5 hover:text-[#0033A1]"
        >
          <XMarkIcon className="mr-1 h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );

  const gridClass = embedded
    ? "grid grid-cols-1 gap-5 sm:grid-cols-2"
    : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";

  const searchColClass = embedded ? "" : "xl:col-span-2";

  const body = (
    <>
      {header}
      <div className={`${gridClass}`}>
        <div className={`space-y-0 ${searchColClass}`}>
          <label className={labelCls}>Search</label>
          <Input
            placeholder="Title, body, reference…"
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="border-slate-200 focus:border-[#0051FF]/40 focus:ring-[#0051FF]/20"
          />
        </div>

        <div>
          <label className={labelCls}>Status</label>
          <Select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            options={[
              { value: "", label: "All" },
              { value: "NEW", label: "New" },
              { value: "PROCESSED", label: "Processed" },
              { value: "ARCHIVED", label: "Archived" },
            ]}
            className="border-slate-200"
          />
        </div>

        <div>
          <label className={labelCls}>Pipeline</label>
          <Select
            value={filters.ideahub_status || ""}
            onChange={(e) =>
              handleFilterChange("ideahub_status", e.target.value)
            }
            options={IDEAHUB_STATUS_OPTIONS}
            className="border-slate-200"
          />
        </div>

        <div>
          <label className={labelCls}>Source</label>
          <Select
            value={filters.source_id || ""}
            onChange={(e) => handleFilterChange("source_id", e.target.value)}
            options={[
              { value: "", label: "All" },
              ...sources.map((s) => ({
                value: String(s.id),
                label: s.name,
              })),
            ]}
            className="border-slate-200"
          />
        </div>

        <div>
          <label className={labelCls}>Idea Category</label>
          <Select
            value={filters.category_id || ""}
            onChange={(e) => handleFilterChange("category_id", e.target.value)}
            options={[
              { value: "", label: "All" },
              ...sortedCategories.map((c) => ({
                value: String(c.id),
                label: c.name,
              })),
            ]}
            className="border-slate-200"
          />
        </div>

        <div>
          <label className={labelCls}>Author</label>
          <Select
            value={filters.author_type || ""}
            onChange={(e) =>
              handleFilterChange("author_type", e.target.value)
            }
            options={[
              { value: "", label: "All" },
              { value: "STAFF", label: "Staff" },
              { value: "CUSTOMER", label: "Customer" },
            ]}
            className="border-slate-200"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div
          className={`border-[#0051FF]/10 pt-4 ${embedded ? "mt-4 border-t" : "mt-5 border-t"}`}
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#0033A1]/60">
            Active
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {filters.search && (
              <span className="rounded-md border border-[#0051FF]/15 bg-[#F0F7FF] px-2 py-1 font-medium text-[#0033A1]">
                “{filters.search}”
              </span>
            )}
            {filters.status && (
              <span className="rounded-md border border-[#0051FF]/15 bg-[#F0F7FF] px-2 py-1 font-medium text-[#0033A1]">
                {filters.status}
              </span>
            )}
            {filters.ideahub_status && (
              <span className="rounded-md border border-[#0051FF]/15 bg-[#F0F7FF] px-2 py-1 font-medium text-[#0033A1]">
                {filters.ideahub_status}
              </span>
            )}
            {filters.source_id && (
              <span className="rounded-md border border-[#0051FF]/15 bg-[#F0F7FF] px-2 py-1 font-medium text-[#0033A1]">
                Source #{filters.source_id}
              </span>
            )}
            {filters.category_id && (
              <span className="rounded-md border border-[#0051FF]/15 bg-[#F0F7FF] px-2 py-1 font-medium text-[#0033A1]">
                Category #{filters.category_id}
              </span>
            )}
            {filters.author_type && (
              <span className="rounded-md border border-[#0051FF]/15 bg-[#F0F7FF] px-2 py-1 font-medium text-[#0033A1]">
                {filters.author_type}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="space-y-4">{body}</div>;
  }

  return (
    <div className="rounded-xl border border-[#0051FF]/12 bg-white p-5 shadow-sm sm:p-6">
      {body}
    </div>
  );
};
