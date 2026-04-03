import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Idea } from "@/types/api";
import {
  DataTable,
  DataTableToolbar,
  RowActionsMenu,
  StatusDotBadge,
  statusToneFromString,
  type DataTableColumn,
} from "@/components/ui";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import { IdeaTableSimilarPanel } from "./IdeaTableSimilarPanel";

/** Native `title` tooltip only when text is visually truncated (ellipsis). */
const EllipsisTip: React.FC<{
  text: string;
  className?: string;
  children: React.ReactNode;
}> = ({ text, className, children }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el || !text) {
      setTruncated(false);
      return;
    }
    setTruncated(el.scrollWidth > el.clientWidth + 1);
  }, [text]);

  useLayoutEffect(() => {
    measure();
  }, [measure, text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <span ref={ref} className={className} title={truncated ? text : undefined}>
      {children}
    </span>
  );
};

interface IdeaTableProps {
  ideas: Idea[];
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onView: (idea: Idea) => void;
  emptyDueToFilters?: boolean;
  /** Hide category column when a single category tab is active */
  hideCategoryColumn?: boolean;
}

function ideaStatusTone(status: Idea["status"]) {
  if (status === "NEW") return "pending" as const;
  if (status === "PROCESSED") return "success" as const;
  return "neutral" as const;
}

const IdeaTableComponent: React.FC<IdeaTableProps> = ({
  ideas,
  onEdit,
  onDelete,
  onView,
  emptyDueToFilters = false,
  hideCategoryColumn = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  /** At most one expand panel open (accordion). */
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const toggleRowExpand = useCallback((rowKey: string) => {
    setExpandedRowKey((prev) => (prev === rowKey ? null : rowKey));
  }, []);

  React.useEffect(() => {
    setExpandedRowKey(null);
  }, [currentPage]);

  const { totalPages, pageIdeas } = useMemo(() => {
    const totalPages = Math.ceil(ideas.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const pageIdeas = ideas.slice(start, start + itemsPerPage);
    return { totalPages, pageIdeas };
  }, [ideas, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [ideas.length, itemsPerPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const columns: DataTableColumn<Idea>[] = useMemo(() => {
    const base: DataTableColumn<Idea>[] = [
      {
        id: "ref",
        header: "Reference",
        headerClassName: "w-32",
        className: "whitespace-nowrap font-mono text-xs text-stanbic-text/65",
        cell: (row) => row.reference_number ?? "—",
      },
      {
        id: "title",
        header: "Title",
        headerClassName: "min-w-[14rem] w-[36%] lg:w-[40%]",
        className: "align-top",
        cell: (row) => (
          <button
            type="button"
            onClick={() => onView(row)}
            className="w-full whitespace-normal break-words py-2 text-left font-medium leading-snug text-stanbic-primary decoration-stanbic-secondary/30 underline-offset-4 hover:text-stanbic-secondary hover:underline"
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
        headerClassName: "w-36 lg:w-40",
        className: "max-w-[10rem] text-stanbic-text/75 lg:max-w-[11rem]",
        cell: (row) => (
          <EllipsisTip
            text={row.category_label}
            className="block truncate"
          >
            {row.category_label}
          </EllipsisTip>
        ),
      });
    }
    base.push(
      {
        id: "source",
        header: "Source",
        headerClassName: "w-32",
        className: "max-w-[8rem] text-stanbic-text/75",
        cell: (row) => (
          <EllipsisTip text={row.source_label} className="block truncate">
            {row.source_label}
          </EllipsisTip>
        ),
      },
      {
        id: "status",
        header: "Status",
        headerClassName: "w-28",
        cell: (row) => (
          <StatusDotBadge
            label={row.status}
            tone={ideaStatusTone(row.status)}
          />
        ),
      },
      {
        id: "pipeline",
        header: "Pipeline",
        headerClassName: "w-32",
        className: "capitalize",
        cell: (row) =>
          row.ideahub_status ? (
            <StatusDotBadge
              label={row.ideahub_status.replace(/_/g, " ")}
              tone={statusToneFromString(row.ideahub_status)}
            />
          ) : (
            "—"
          ),
      },
      {
        id: "actions",
        header: "",
        headerClassName: "w-24 sm:w-[5.75rem]",
        className:
          "w-24 text-right !pl-2 !pr-6 sm:w-[5.75rem] sm:!pr-7",
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
    <div className="min-w-0 max-w-full px-4 py-5 sm:px-6 sm:py-6">
      <DataTableToolbar total={ideas.length} totalLabel="ideas" />
      <DataTable
        columns={columns}
        rows={pageIdeas}
        getRowKey={(r) => r.id}
        tableClassName="table-fixed"
        minWidthClass="min-w-[680px]"
        renderExpandedRow={(row) => (
          <IdeaTableSimilarPanel ideaId={row.id} />
        )}
        isRowExpanded={(key) => expandedRowKey === key}
        onToggleRowExpand={toggleRowExpand}
        getExpandAriaLabel={(row) =>
          expandedRowKey === row.id
            ? `Hide similar ideas for ${row.title}`
            : `Show similar ideas for ${row.title}`
        }
      />
      {totalPages > 1 ? (
        <div className="mt-6 border-t border-stanbic-border pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={ideas.length}
            itemsPerPage={itemsPerPage}
            variant="stanbic"
            pageSizeOptions={[10, 12, 15, 25]}
            onPageSizeChange={setItemsPerPage}
          />
        </div>
      ) : null}
    </div>
  );
};

export const IdeaTable = React.memo(IdeaTableComponent);
