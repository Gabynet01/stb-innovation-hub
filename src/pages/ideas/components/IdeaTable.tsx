import React, { useCallback, useMemo, useState } from "react";
import { Idea } from "@/types/api";
import { DataTable, RowActionsMenu, type DataTableColumn } from "@/components/ui";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";

interface IdeaTableProps {
  ideas: Idea[];
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onView: (idea: Idea) => void;
  emptyDueToFilters?: boolean;
  /** Hide category column when a single category tab is active */
  hideCategoryColumn?: boolean;
  /** Table sits inside category card — no double border */
  flush?: boolean;
}

function statusBadge(status: Idea["status"]) {
  const map: Record<Idea["status"], string> = {
    NEW: "bg-[#0051FF]/10 text-[#0033A1] ring-1 ring-[#0051FF]/15",
    PROCESSED: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100",
    ARCHIVED: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

const IdeaTableComponent: React.FC<IdeaTableProps> = ({
  ideas,
  onEdit,
  onDelete,
  onView,
  emptyDueToFilters = false,
  hideCategoryColumn = false,
  flush = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { totalPages, pageIdeas } = useMemo(() => {
    const totalPages = Math.ceil(ideas.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const pageIdeas = ideas.slice(start, start + itemsPerPage);
    return { totalPages, pageIdeas };
  }, [ideas, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [ideas.length]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const columns: DataTableColumn<Idea>[] = useMemo(() => {
    const base: DataTableColumn<Idea>[] = [
      {
        id: "ref",
        header: "Reference",
        className: "whitespace-nowrap font-mono text-xs text-slate-600",
        cell: (row) => row.reference_number ?? "—",
      },
      {
        id: "title",
        header: "Title",
        cell: (row) => (
          <button
            type="button"
            onClick={() => onView(row)}
            className="max-w-[220px] truncate text-left font-medium text-[#0033A1] decoration-[#0051FF]/30 underline-offset-4 hover:text-[#0051FF] hover:underline sm:max-w-xs"
          >
            {row.title}
          </button>
        ),
      },
    ];
    if (!hideCategoryColumn) {
      base.push({
        id: "category",
        header: "Idea Category",
        className: "text-slate-600",
        cell: (row) => row.category_label,
      });
    }
    base.push(
      {
        id: "source",
        header: "Source",
        className: "text-slate-600",
        cell: (row) => row.source_label,
      },
      {
        id: "status",
        header: "Status",
        cell: (row) => statusBadge(row.status),
      },
      {
        id: "pipeline",
        header: "Pipeline",
        className: "text-slate-600 text-xs capitalize",
        cell: (row) =>
          row.ideahub_status
            ? row.ideahub_status.replace(/_/g, " ")
            : "—",
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-14",
        className: "w-14 text-right",
        cell: (row) => (
          <RowActionsMenu
            ariaLabel={`Actions for ${row.title}`}
            items={[
              {
                key: "view",
                label: "View",
                onClick: () => onView(row),
              },
              {
                key: "edit",
                label: "Edit",
                onClick: () => onEdit(row),
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => void onDelete(row.id),
              },
            ]}
          />
        ),
      },
    );
    return base;
  }, [hideCategoryColumn, onDelete, onEdit, onView]);

  if (ideas.length === 0) {
    return <EmptyState hasFilters={emptyDueToFilters} />;
  }

  return (
    <div className={flush ? "space-y-0" : "space-y-6"}>
      <DataTable
        variant="minimal"
        flush={flush}
        columns={columns}
        rows={pageIdeas}
        getRowKey={(r) => r.id}
        minWidthClass="min-w-[720px]"
      />
      {totalPages > 1 && (
        <div
          className={
            flush
              ? "border-t border-slate-100 bg-slate-50/40 px-5 sm:px-8"
              : undefined
          }
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={ideas.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export const IdeaTable = React.memo(IdeaTableComponent);
